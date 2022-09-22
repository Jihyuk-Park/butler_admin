import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Grid from '@mui/material/Grid';
import NavBar from './component/NavBar';
import UserInfo from './pages/UserInfo';
import UserMemo from './pages/UserMemo';

function App() {
  return (
    <div className="App">
      <Grid container rowSpacing={1} sx={{ p: 2, backgroundColor: '#F0F2F5' }}>
        <Grid item xs={1.8}>
          <NavBar />
        </Grid>
        <Grid item xs={10.2}>
          <Routes>
            <Route path="/UserInfo" element={<UserInfo />} />
            <Route path="/UserMemo" element={<UserMemo />} />
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
