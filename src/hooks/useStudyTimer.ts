import { useState, useEffect, useRef, useCallback } from 'react';

interface StudySession {
  date: string;
  duration: number;
  pages: number;
}

interface StudyData {
  sessions: StudySession[];
  currentSession: {
    startTime: number;
    duration: number;
    pagesRead: number;
    lastActiveTime: number;
  } | null;
}

interface UseStudyTimerReturn {
  currentSessionTime: number;
  todayTotal: number;
  weekTotal: number;
  currentSessionPages: number;
  incrementPages: () => void;
}

const STORAGE_KEY = 'kindleStudyStats';

export const useStudyTimer = (bookTitle: string): UseStudyTimerReturn => {
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [currentSessionPages, setCurrentSessionPages] = useState(0);
  const [isTabFocused, setIsTabFocused] = useState(!document.hidden);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Load data from localStorage
  const loadStudyData = useCallback((): StudyData => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) return { sessions: [], currentSession: null };
      
      const allData = JSON.parse(storedData);
      return allData[bookTitle] || { sessions: [], currentSession: null };
    } catch {
      return { sessions: [], currentSession: null };
    }
  }, [bookTitle]);

  // Save data to localStorage
  const saveStudyData = useCallback((data: StudyData) => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY) || '{}';
      const allData = JSON.parse(storedData);
      allData[bookTitle] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('Failed to save study data:', error);
    }
  }, [bookTitle]);

  // Calculate today's total
  const calculateTodayTotal = useCallback((sessions: StudySession[], currentDuration: number) => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === today);
    const todaySessionsTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    return todaySessionsTotal + currentDuration;
  }, []);

  // Calculate week's total
  const calculateWeekTotal = useCallback((sessions: StudySession[], currentDuration: number) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
    const weekSessionsTotal = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    return weekSessionsTotal + currentDuration;
  }, []);

  // Initialize or resume session
  useEffect(() => {
    const data = loadStudyData();
    
    if (data.currentSession) {
      // Resume existing session
      setCurrentSessionTime(data.currentSession.duration);
      setCurrentSessionPages(data.currentSession.pagesRead);
    } else {
      // Start new session
      const newSession = {
        startTime: Date.now(),
        duration: 0,
        pagesRead: 0,
        lastActiveTime: Date.now(),
      };
      saveStudyData({ ...data, currentSession: newSession });
    }

    // Calculate totals
    setTodayTotal(calculateTodayTotal(data.sessions, data.currentSession?.duration || 0));
    setWeekTotal(calculateWeekTotal(data.sessions, data.currentSession?.duration || 0));
  }, [bookTitle, loadStudyData, saveStudyData, calculateTodayTotal, calculateWeekTotal]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const focused = !document.hidden;
      setIsTabFocused(focused);
      
      if (focused) {
        lastUpdateTimeRef.current = Date.now();
      } else {
        // Save current progress when tab loses focus
        const data = loadStudyData();
        if (data.currentSession) {
          data.currentSession.duration = currentSessionTime;
          data.currentSession.pagesRead = currentSessionPages;
          data.currentSession.lastActiveTime = Date.now();
          saveStudyData(data);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentSessionTime, currentSessionPages, loadStudyData, saveStudyData]);

  // Timer logic - only runs when tab is focused
  useEffect(() => {
    if (isTabFocused) {
      intervalRef.current = setInterval(() => {
        setCurrentSessionTime(prev => {
          const newTime = prev + 1;
          
          // Update totals
          const data = loadStudyData();
          setTodayTotal(calculateTodayTotal(data.sessions, newTime));
          setWeekTotal(calculateWeekTotal(data.sessions, newTime));
          
          // Save every 10 seconds
          if (newTime % 10 === 0) {
            if (data.currentSession) {
              data.currentSession.duration = newTime;
              data.currentSession.lastActiveTime = Date.now();
              saveStudyData(data);
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTabFocused, loadStudyData, saveStudyData, calculateTodayTotal, calculateWeekTotal]);

  // Increment pages read
  const incrementPages = useCallback(() => {
    setCurrentSessionPages(prev => {
      const newPages = prev + 1;
      
      // Save immediately
      const data = loadStudyData();
      if (data.currentSession) {
        data.currentSession.pagesRead = newPages;
        saveStudyData(data);
      }
      
      return newPages;
    });
  }, [loadStudyData, saveStudyData]);

  // End session when unmounting
  useEffect(() => {
    return () => {
      const data = loadStudyData();
      if (data.currentSession && currentSessionTime > 0) {
        // Save current session to sessions array
        const today = new Date().toISOString().split('T')[0];
        data.sessions.push({
          date: today,
          duration: currentSessionTime,
          pages: currentSessionPages,
        });
        data.currentSession = null;
        saveStudyData(data);
      }
    };
  }, [currentSessionTime, currentSessionPages, loadStudyData, saveStudyData]);

  return {
    currentSessionTime,
    todayTotal,
    weekTotal,
    currentSessionPages,
    incrementPages,
  };
};