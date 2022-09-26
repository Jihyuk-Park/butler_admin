import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function NavBar() {
  const navigate = useNavigate();

  const [companyList, setCompanyList] = useState(false);
  const [userList, setUserList] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(999);

  const userMenu = [
    '유저 정보',
    '유저 사용 정보',
    '전체 유저 정보',
    '기업 사용 정보',
    '일별 전체 기업',
    '메모',
  ];
  const userUrl = [
    '/UserInfo',
    '/UserUsage',
    '/UserEntire',
    '/UserCompanyUsage',
    '/UserDailyUsage',
    '/UserMemo',
  ];

  const companyMenu = [
    '기업 목록',
    '주식',
    '배당',
    '자사주',
    '직원',
    '임원보수',
    'IR',
    '부문별 실적',
    '지역별 실적',
  ];
  const companyUrl = [
    '/CompanyList',
    '/Stock',
    '/Dividend',
    '/TreasuryStock',
    '/Employee',
    '/Executive',
    '/IR',
    '/PerformanceBySector',
    '/PerformanceByRegion',
  ];

  const openCompanyList = () => {
    setCompanyList(true);
  };
  const closeCompanyList = () => {
    setCompanyList(false);
  };
  const openUserList = () => {
    setUserList(true);
  };
  const closeUserList = () => {
    setUserList(false);
  };
  const goToLink = (link, num, which) => {
    navigate(link);
    if (which === 'company') {
      setSelectedMenu(num);
    } else {
      setSelectedMenu(num + 100);
    }
  };
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <nav>
        <Box
          sx={{
            background: 'linear-gradient(180deg, #3E3E45 0%, #1D1C1D 100%);',
            height: '90vh',
            width: '13vw',
            p: 1,
            pt: 3,
            borderRadius: '12px 0px 0px 12px',
            overflowY: 'scroll',
            position: 'fixed',
          }}
        >
          <Typography
            onClick={goToHome}
            variant="h6"
            color="#FFFFFF"
            fontWeight={600}
            sx={{ cursor: 'pointer' }}
          >
            Butler Admin
          </Typography>
          <Button
            onClick={companyList === false ? openCompanyList : closeCompanyList}
            sx={{ color: 'white', fontSize: '1.15rem', width: '11vw', mb: '5px', mt: '40px' }}
          >
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <BusinessIcon />
              기업
              {companyList === false ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </Grid>
          </Button>
          {companyList === false ? null : (
            <div>
              {companyMenu.map(function (eachdata, index) {
                return (
                  <Button
                    key={eachdata}
                    onClick={() => goToLink(companyUrl[index], index, 'company')}
                    sx={[
                      selectedMenu === index ? { backgroundColor: '#F1A239' } : { opacity: 0.5 },
                      { color: 'white', width: '11vw', fontWeight: 600 },
                    ]}
                  >
                    {eachdata}
                  </Button>
                );
              })}
            </div>
          )}
          <Button
            onClick={userList === false ? openUserList : closeUserList}
            sx={{ color: 'white', fontSize: '1.15rem', width: '11vw', mt: '10px', mb: '5px' }}
          >
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <PersonIcon />
              유저
              {userList === false ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </Grid>
          </Button>
          {userList === false ? null : (
            <div>
              {userMenu.map(function (eachdata, index) {
                return (
                  <Button
                    key={eachdata}
                    onClick={() => goToLink(userUrl[index], index, 'user')}
                    sx={[
                      selectedMenu === index + 100
                        ? { backgroundColor: '#F1A239' }
                        : { opacity: 0.5 },
                      { color: 'white', width: '11vw', fontWeight: 600 },
                    ]}
                  >
                    {eachdata}
                  </Button>
                );
              })}
            </div>
          )}
        </Box>
      </nav>
    </div>
  );
}
