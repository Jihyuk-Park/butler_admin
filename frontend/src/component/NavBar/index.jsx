import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function NavBar() {
  const navigate = useNavigate();

  const [companyMenuList, setCompanyMenuList] = useState(false);
  const [selectedCompanyMenu, setSelectedCompanyMenu] = useState(100);
  const [userList, setUserList] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState('');

  const userMenu = [
    '유저 정보',
    '유저 사용 정보',
    '전체 유저 정보',
    '기업 사용 정보',
    '일별 전체 기업',
    '메모',
  ];
  const userUrl = [
    '/User/UserInfo',
    '/User/UserUsage',
    '/User/UserEntire',
    '/User/UserCompanyUsage',
    '/User/UserDailyCompany',
    '/User/UserMemo',
  ];

  const companyMenu = ['비재무 데이터', '재무 데이터', 'Raw Data'];

  const nonFinancialMenu = [
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
  const nonFinancialUrl = [
    '/Company/nonFinancial/CompanyList',
    '/Company/nonFinancial/Stock',
    '/Company/nonFinancial/Dividend',
    '/Company/nonFinancial/TreasuryStock',
    '/Company/nonFinancial/Employee',
    '/Company/nonFinancial/Executive',
    '/Company/nonFinancial/IR',
    '/Company/nonFinancial/PerformanceBySector',
    '/Company/nonFinancial/PerformanceByRegion',
  ];

  const FinancialMenu = ['재무상태표', '손익계산서', '현금흐름표', '분석', '밸류에이션'];
  const FinancialUrl = [
    '/Compamny/Financial/FinancialStatement',
    '/Compamny/Financial/IncomeStatement',
    '/Compamny/Financial/CashFlowStatement',
    '/Compamny/Financial/Analysis',
    '/Compamny/Financial/Valuation',
  ];

  const RawDataMenu = ['재무상태표(Raw)', '손익계산서(Raw)', '현금흐름표(Raw)'];
  const RawDataUrl = [
    '/Company/RawData/RawFinancialStatement',
    '/Company/RawData/RawIncomeStatement',
    '/Company/RawData/RawCashFlowStatement',
  ];

  const companyMenuArray = [nonFinancialMenu, FinancialMenu, RawDataMenu];
  const companyUrlArray = [nonFinancialUrl, FinancialUrl, RawDataUrl];

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
              {companyMenu.map(function (eachdata, index) {
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
