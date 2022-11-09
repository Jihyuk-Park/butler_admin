import React, { useState } from 'react';
import { Card, Typography, Grid, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';

export default function Entrance({ setIsLogin }) {
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const onChangeId = e => {
    setInputId(e.target.value);
  };

  const onChangePassword = e => {
    setInputPassword(e.target.value);
  };

  // 엔터 로그인
  const onCheckEnter = e => {
    if (e.key === 'Enter') {
      login();
    }
  };

  const login = () => {
    if (inputId === process.env.REACT_APP_ADMINID) {
      if (inputPassword === process.env.REACT_APP_ADMINPASSWORD) {
        setIsLogin(true);
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
    } else {
      alert('아이디가 올바르지 않습니다.');
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', backgroundColor: '#202026' }}
    >
      <Typography variant="h3" color="primary" sx={{ mt: '-55px' }}>
        Butler Admin
      </Typography>

      <Grid container justifyContent="center" sx={{ pt: '40px' }}>
        <Card sx={{ width: '450px', py: '30px', px: '40px', opacity: 0.8 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: '20px' }}>
            로그인
          </Typography>
          <Typography align="left">아이디</Typography>
          <TextField
            fullWidth
            value={inputId}
            onChange={onChangeId}
            onKeyPress={onCheckEnter}
            sx={{ mb: '20px' }}
          />
          <Typography align="left">비밀번호</Typography>
          <form>
            <TextField
              fullWidth
              value={inputPassword}
              onChange={onChangePassword}
              onKeyPress={onCheckEnter}
              type="password"
              autoComplete="off"
            />
          </form>
          <Button
            variant="contained"
            onClick={login}
            sx={{ color: 'white', mt: '30px', width: '150px' }}
          >
            로그인
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
}

Entrance.defaultProps = {
  setIsLogin: () => {},
};

Entrance.propTypes = {
  setIsLogin: PropTypes.func,
};
