import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 기업 메뉴 드롭다운
  const [companyMenuList, setCompanyMenuList] = useState(false);
  const [selectedCompanyMenu, setSelectedCompanyMenu] = useState(100);
  // 유저 메뉴 드롭다운
  const [userList, setUserList] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState('');

  const userMenu = [
    '유저 기본 정보',
    '유저 활동 정보',
    '가입자 통계',
    '기업별 통계',
    '일별 기업 통계',
    '토론실',
  ];
  const userUrl = [
    '/User/UserInfo',
    '/User/UserUsage',
    '/User/UserEntire',
    '/User/UserCompanyUsage',
    '/User/UserDailyCompany',
    '/User/UserMemo',
  ];

  // 2depth 메뉴 - 1. 기업목록 ~ 3.개별기업
  const companyMenuSingle = ['기업목록', '기업탐색', '개별기업'];
  const companyMenuSingleURL = [
    '/Company/CompanyList',
    '/Company/SearchCompany',
    '/Company/IndividualCompany',
  ];

  // 3depth 이상 - 4. 재무제표 ~ 8. 지역별
  const companyMenuMutlple = ['재무제표', '기타정보', 'IR', '부문별', '지역별'];

  // 하위 메뉴 목록
  // 4. 재무제표 ~ 8. 지역별
  const financialMenu = [
    '손익계산서',
    '현금흐름표',
    '분석',
    '밸류',
    'DART API',
    '크롤링',
    '재무상태표',
  ];
  const financialUrl = [
    '/Company/Financial/IncomeStatement',
    '/Company/Financial/CashFlowStatement',
    '/Company/Financial/Analysis',
    '/Company/Financial/Valuation',
    '/Company/Financial/DartAPI',
    '/Company/Financial/Crawling',
    '/Company/Financial/FinancialStatement',
  ];

  const otherInfoMenu = ['공시 목록', '주식', '배당', '자사주', '직원', '임원', '소액주주'];
  const otherInfoUrl = [
    '/Company/OtherInfo/Disclosure',
    '/Company/OtherInfo/Stock',
    '/Company/OtherInfo/Dividend',
    '/Company/OtherInfo/Buyback',
    '/Company/OtherInfo/Employee',
    '/Company/OtherInfo/Executive',
    '/Company/OtherInfo/MinorityShareHolders',
  ];

  const irMenu = ['목록(IR)', '개별기업(IR)'];
  const irUrl = ['/Company/IR/List', '/Company/IR/Individual/main'];

  const sectorMenu = ['목록(부문별)', '개별기업(부문별)'];
  const sectorUrl = ['/Company/Sector/List', '/Company/Sector/Individual/main'];

  const regionMenu = ['목록(지역별)', '개별기업(지역별)'];
  const regionUrl = ['/Company/Geography/List', '/Company/Geography/Individual/main'];

  const companyMenuArray = [financialMenu, otherInfoMenu, irMenu, sectorMenu, regionMenu];
  const companyUrlArray = [financialUrl, otherInfoUrl, irUrl, sectorUrl, regionUrl];

  // navBar 외에서 이동하는 것 보정
  useEffect(() => {
    if (location.pathname.includes('IR/Individual')) {
      setSelectedMenu('개별기업(IR)');
    } else if (location.pathname.includes('Sector/Individual')) {
      setSelectedMenu('개별기업(부문별)');
    } else if (location.pathname.includes('Geography/Individual')) {
      setSelectedMenu('개별기업(지역별)');
    }
  }, [location.pathname]);

  const openCompanyMenuList = () => {
    setCompanyMenuList(true);
  };
  const closeCompanyMenuList = () => {
    setCompanyMenuList(false);
  };
  const openUserList = () => {
    setUserList(true);
  };
  const closeUserList = () => {
    setUserList(false);
  };
  const goToLink = (link, eachdata) => {
    navigate(link);
    setSelectedMenu(eachdata);
  };
  const goToHome = () => {
    navigate('/');
  };

  const openSelectedCompanyMenu = ind => {
    setSelectedCompanyMenu(ind);
  };

  const closeSelectedCompanyMenu = () => {
    setSelectedCompanyMenu(100);
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
            onClick={companyMenuList === false ? openCompanyMenuList : closeCompanyMenuList}
            sx={{ color: 'white', fontSize: '1.15rem', width: '11vw', mb: '5px', mt: '40px' }}
          >
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <BusinessIcon />
              기업
              {companyMenuList === false ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </Grid>
          </Button>

          {/* 기업 메뉴 */}
          {companyMenuList === false ? null : (
            <div>
              {/* 2depth 메뉴 */}
              {companyMenuSingle.map(function (eachdata, index) {
                return (
                  <div key={eachdata}>
                    <Button
                      onClick={() => {
                        goToLink(companyMenuSingleURL[index], eachdata);
                        openSelectedCompanyMenu(index + 50);
                      }}
                      sx={[
                        selectedCompanyMenu === index + 50 ? null : { opacity: 0.6 },
                        { color: 'white', width: '11vw', fontWeight: 400, fontSize: '1.05rem' },
                      ]}
                    >
                      {eachdata}
                    </Button>
                  </div>
                );
              })}

              {/* 3depth 메뉴 */}
              {companyMenuMutlple.map(function (eachdata, index) {
                return (
                  <div key={eachdata}>
                    <Button
                      onClick={
                        index === selectedCompanyMenu
                          ? closeSelectedCompanyMenu
                          : () => openSelectedCompanyMenu(index)
                      }
                      sx={[
                        selectedCompanyMenu === index ? null : { opacity: 0.6 },
                        { color: 'white', width: '11vw', fontWeight: 400, fontSize: '1.05rem' },
                      ]}
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box />
                        {eachdata}
                        {selectedCompanyMenu === index ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </Grid>
                    </Button>

                    {/* 하위 메뉴들 */}
                    {selectedCompanyMenu === index ? (
                      <div>
                        {companyMenuArray[index].map(function (eachdata2, index2) {
                          return (
                            <Button
                              key={eachdata2}
                              onClick={() => goToLink(companyUrlArray[index][index2], eachdata2)}
                              sx={[
                                selectedMenu === eachdata2
                                  ? { backgroundColor: '#F1A239' }
                                  : { opacity: 0.5 },
                                { color: 'white', width: '11vw', fontWeight: 600 },
                              ]}
                            >
                              {eachdata2}
                            </Button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          {/* 유저 메뉴 */}
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
                    onClick={() => goToLink(userUrl[index], eachdata)}
                    sx={[
                      selectedMenu === eachdata ? { backgroundColor: '#F1A239' } : { opacity: 0.5 },
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
