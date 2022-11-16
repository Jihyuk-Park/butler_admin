import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// MUI 전체 테마
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9D00',
    },
    secondary: {
      main: '#10263B',
    },
    inactive: {
      main: '#999999',
    },
    red: {
      main: '#C21807',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        style: { fontWeight: 600, maxWidth: '400px' },
      },
    },
    MuiTextField: {
      defaultProps: {
        inputProps: {
          style: { padding: 10, backgroundColor: '#FFFFFF' },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        SelectDisplayProps: {
          style: { padding: '10px 50px 10px 15px', backgroundColor: '#FFFFFF' },
        },
      },
    },
    MuiTable: {
      defaultProps: {
        style: { borderSpacing: 0, borderCollapse: 'collapse' },
      },
    },
    MuiTableCell: {
      defaultProps: {
        align: 'center',
        style: { borderSpacing: 0, borderCollapse: 'collapse' },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
