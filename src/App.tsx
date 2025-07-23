import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import KindleReader from './components/KindleReader';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#e8e8e8',
    },
  },
  typography: {
    fontFamily: 'Georgia, serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <KindleReader />
    </ThemeProvider>
  );
}

export default App;
