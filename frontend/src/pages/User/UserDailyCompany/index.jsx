import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Grid,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import OutLinedBox from '../../../component/UI/OutLinedBox';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import FixedBox from '../../../component/UI/FixedBox';
import { url } from '../../../component/commonVariable';
import { changeDateDot, addComma } from '../../../component/commonFunction';
import CompanyListAutoComplete from '../../../component/CompanyListAutoComplete';
import Pagination from '../../../component/Pagination/index';

export default function UserDailyCompany() {
  // 데이터 정렬 기준 선택
  const [sortField, setSortField] = useState('일자');
  const [sortType, setSortType] = useState('▼');

  // 일별 전체 기업 정보 데이터 관련
  const dataTable = [
    '일자',
    '가입자의 검색 횟수',
    '비 가입자의 검색 횟수',
    '검색 횟수 총합',
    '관심목록 신규 유저 수',
    '관심목록 누적 유저 수',
  ];
  const [userDailyCompanyData, setUserDailyCompanyData] = useState([]);

  // 노출 조건 설정
  const searchField = ['기업명', '검색 횟수', '관심 목록 유저 수'];
  const [searchInput, setSearchInput] = useState({
    searchCountingStart: '',
    searchCountingEnd: '',
    searchUserCountingStart: '',
    searchUserCountingEnd: '',
  });
  const { searchCountingStart, searchCountingEnd, searchUserCountingStart, searchUserCountingEnd } =
    searchInput;
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(true);
  // * 기업명 삭제 스위치 & 조건을 위해 회사 이름 대신 companyCode
  const [clearSwitch, setClearSwitch] = useState(0);
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  const searchInputArray = [
    [searchCountingStart, searchCountingEnd],
    [searchUserCountingStart, searchUserCountingEnd],
  ];

  const searchInputNameArray = [
    ['searchCountingStart', 'searchCountingEnd'],
    ['searchUserCountingStart', 'searchUserCountingEnd'],
  ];

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(100);

  // 유저 정보 데이터를 받아오는 Hook
  // 검색 유무에 따라 전체 데이터 혹은 일치하는 데이터
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userDailyCompany/getData/all/${page}/${sortField}/${sortType}`)
        .then(result => {
          // console.log(result.data);
          setUserDailyCompanyData(result.data);
          setIsSearch(false);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      // eslint-disable-next-line object-shorthand
      const body = { searchCompanyCode: searchCompanyCode, ...searchInput };
      axios
        .get(`${url}/admin/user/userDailyCompany/getData/search/${page}/${sortField}/${sortType}`, {
          params: body,
        })
        .then(result => {
          // console.log(result.data);
          setUserDailyCompanyData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [page, sortField, sortType, refreshSwitch]);

  // 전체 페이지 수 계산을 위한 Hook (무한 스크롤)
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userDailyCompany/getTotalNum/all`)
        .then(result => {
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      // eslint-disable-next-line object-shorthand
      const body = { searchCompanyCode: searchCompanyCode, ...searchInput };
      axios
        .get(`${url}/admin/user/userDailyCompany/getTotalNum/search`, {
          params: body,
        })
        .then(result => {
          // console.log(result.data);
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [isSearch, refreshSwitch]);

  // 정렬
  const sortData = field => {
    if (sortField !== field) {
      setSortField(field);
    } else if (sortField === field) {
      if (sortType === '▼') {
        setSortType('▲');
      } else {
        setSortField('일자');
        setSortType('▼');
      }
    }
  };

  // 노출 조건 입력 input
  const onChangeSearchInput = e => {
    const { name, value } = e.target;
    setSearchInput({
      ...searchInput,
      [name]: value,
    });
  };

  // 노출 조건 입력 (검색어로 데이터 로드)
  const searchUserDailyCompany = () => {
    if (searchInput.length === 0) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
    setPage(1);
    setUserDailyCompanyData([]);
    setRefreshSwitch(!refreshSwitch);
  };

  // 노출 조건 부분 리센
  const onPartsReset = ind => {
    if (ind === 0) {
      setClearSwitch(clearSwitch + 1);
      setSearchCompanyCode('');
    } else if (ind === 1) {
      setSearchInput({
        ...searchInput,
        searchCountingStart: '',
        searchCountingEnd: '',
      });
    } else {
      setSearchInput({
        ...searchInput,
        searchUserCountingStart: '',
        searchUserCountingEnd: '',
      });
    }
  };

  // 노출 조건 전체 리셋
  const onAllReset = () => {
    setClearSwitch(clearSwitch + 1);
    setSearchCompanyCode('');
    setSearchInput({
      searchCountingStart: '',
      searchCountingEnd: '',
      searchUserCountingStart: '',
      searchUserCountingEnd: '',
    });
  };

  return (
    <Grid container columnSpacing={2}>
      {/* 일별 전체 기업 데이터 영역 */}
      <Grid item xs={8}>
        <TableContainer component={Paper} sx={{ maxHeight: { md: '555px', xl: '885px' } }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {dataTable.map(function (eachdata) {
                  return (
                    <StyledTableCell
                      key={eachdata}
                      onClick={() => {
                        sortData(eachdata);
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      {eachdata} {sortField === eachdata ? sortType : null}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {userDailyCompanyData.map(eachdata => (
                <StyledTableRow key={changeDateDot(eachdata.date)}>
                  <StyledTableCell component="th" scope="row">
                    {changeDateDot(eachdata.date)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {addComma(eachdata.memberSearchCounting) || 0}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {addComma(eachdata.nonMemberSearchCounting) || 0}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {addComma(eachdata.totalSearchCounting) || 0}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {addComma(eachdata.watchCounting) || 0}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {addComma(eachdata.totalWatchCounting) || 0}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* 필터 검색 영역 */}
      <Grid item xs={4}>
        <FixedBox>
          {/* 필터링1 - 노출 조건 설정 */}
          <OutLinedBox sx={{ pt: '15px' }}>
            <Grid container alignItems="flex-start" sx={{ mb: '10px' }}>
              <Typography fontSize="17px" fontWeight="600">
                노출 조건 설정
              </Typography>
            </Grid>
            {searchField.map(function (eachdata, index) {
              return (
                <Grid key={eachdata} container alignItems="center" spacing={1} sx={{ mb: '10px' }}>
                  <Grid item xs={2.3}>
                    <Typography component="div" fontSize={14} align="left">
                      {eachdata}
                    </Typography>
                  </Grid>
                  <Grid item xs={7.2}>
                    {index === 1 || index === 2 ? (
                      <Grid container alignItems="center">
                        <TextField
                          onChange={onChangeSearchInput}
                          name={searchInputNameArray[index - 1][0]}
                          value={searchInputArray[index - 1][0]}
                          sx={{ width: 0.45 }}
                        />
                        &nbsp;-&nbsp;
                        <TextField
                          onChange={onChangeSearchInput}
                          name={searchInputNameArray[index - 1][1]}
                          value={searchInputArray[index - 1][1]}
                          sx={{ width: 0.45 }}
                        />
                      </Grid>
                    ) : (
                      <CompanyListAutoComplete
                        onChangeCompanyCode={setSearchCompanyCode}
                        clearSwitch={clearSwitch}
                      />
                    )}
                  </Grid>
                  <Grid item xs={2.2}>
                    <Button
                      onClick={() => onPartsReset(index)}
                      variant="contained"
                      color="secondary"
                      sx={{ px: 0.5 }}
                    >
                      초기화
                    </Button>
                  </Grid>
                </Grid>
              );
            })}
            <Button
              onClick={searchUserDailyCompany}
              fullWidth
              variant="contained"
              sx={{ color: '#FFFFFF', my: '10px' }}
            >
              검색
            </Button>
            <Button onClick={onAllReset} fullWidth variant="contained" color="secondary">
              조건 초기화
            </Button>
          </OutLinedBox>
        </FixedBox>
      </Grid>

      <Grid item xs={12}>
        <Pagination page={page} totalItem={totalItem} setPage={setPage} />
      </Grid>
    </Grid>
  );
}
