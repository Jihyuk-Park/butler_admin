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
  Box,
  TextField,
  Typography,
} from '@mui/material';
import { url } from '../../../component/constVariable';
import OutLinedBox from '../../../component/UI/OutLinedBox';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import FixedBox from '../../../component/UI/FixedBox';
import DropDown from '../../../component/UI/DropDown';
import Pagination from '../../../component/UI/Pagination';

export default function UserCompanyUsage() {
  // 데이터 정렬 기준 선택
  const sortFieldList = [
    '가입자의 검색 횟수',
    '비 가입자의 검색 횟수',
    '검색 횟수 총합',
    '관심목록 수',
    '작성된 메모 수',
  ];
  const [sortField, setSortField] = useState('가입자의 검색 횟수');
  const [sortType, setSortType] = useState('내림차순');

  // 기업 사용 정보 데이터 관련
  const dataTable = [
    '기업명',
    '가입자의 검색 횟수',
    '비 가입자의 검색 횟수',
    '검색 횟수 총합',
    '관심목록 수',
    '작성된 메모 수',
  ];
  const [userCompanyUsageData, setUserCompanyUsageData] = useState([]);

  // 노출 조건 설정 관련
  const searchField = ['기업명', '검색 횟수', '관심 목록 유저 수'];
  const [searchInput, setSearchInput] = useState({
    searchCompanyName: '',
    searchCountingStart: '',
    searchCountingEnd: '',
    searchUserCountingStart: '',
    searchUserCountingEnd: '',
    searchCompanyStart: '',
    searchCompanyEnd: '',
  });
  const {
    searchCompanyName,
    searchCountingStart,
    searchCountingEnd,
    searchUserCountingStart,
    searchUserCountingEnd,
    searchCompanyStart,
    searchCompanyEnd,
  } = searchInput;
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(true);

  const searchInputArray = [
    searchCompanyName,
    [searchCountingStart, searchCountingEnd],
    [searchUserCountingStart, searchUserCountingEnd],
    [searchCompanyStart, searchCompanyEnd],
  ];

  const searchInputNameArray = [
    'searchCompanyName',
    ['searchCountingStart', 'searchCountingEnd'],
    ['searchUserCountingStart', 'searchUserCountingEnd'],
    ['searchCompanyStart', 'searchCompanyEnd'],
  ];

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(100);

  // 유저 정보 데이터를 받아오는 Hook
  // 검색 유무에 따라 전체 데이터 혹은 일치하는 데이터
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userCompanyUsage/getData/all/${page}/${sortField}/${sortType}`)
        .then(result => {
          // console.log(result.data);
          setUserCompanyUsageData(result.data);
          setIsSearch(false);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userCompanyUsage/getData/search/${page}/${sortField}/${sortType}`, {
          params: searchInput,
        })
        .then(result => {
          // console.log(result.data);
          setUserCompanyUsageData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [page, refreshSwitch, sortField, sortType]);

  // 전체 페이지 수 계산을 위한 Hook (무한 스크롤)
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userCompanyUsage/getTotalNum/all`)
        .then(result => {
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userCompanyUsage/getTotalNum/search`, {
          params: searchInput,
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

  // 데이터 정렬 타입 선택
  const selectField = e => {
    setUserCompanyUsageData([]);
    setPage(1);
    setSortField(e.target.value);
  };

  // 내림/오름차순 선택
  const selectSortType = () => {
    setUserCompanyUsageData([]);
    setPage(1);
    if (sortType === '내림차순') {
      setSortType('오름차순');
    } else {
      setSortType('내림차순');
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
  const searchUserCompanyUsage = () => {
    if (searchInput.length === 0) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
    setPage(1);
    setUserCompanyUsageData([]);
    setRefreshSwitch(!refreshSwitch);
  };

  // 노출 조건 부분 초기화
  const onPartsReset = ind => {
    if (ind === 0) {
      setSearchInput({
        ...searchInput,
        searchCompanyName: '',
      });
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

  // 노출 조건 전체 초기화
  const onAllReset = () => {
    setSearchInput({
      searchCompanyName: '',
      searchCountingStart: '',
      searchCountingEnd: '',
      searchUserCountingStart: '',
      searchUserCountingEnd: '',
      searchCompanyStart,
      searchCompanyEnd,
    });
  };

  return (
    <div>
      {/* 정렬 영역  */}
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        <DropDown
          value={sortField}
          label="정렬 타입"
          onChange={selectField}
          selectList={sortFieldList}
        />
        <Button
          onClick={selectSortType}
          color={sortType === '내림차순' ? 'primary' : 'inactive'}
          sx={{ ml: '15px' }}
        >
          내림차순
        </Button>
        <Button onClick={selectSortType} color={sortType === '오름차순' ? 'primary' : 'inactive'}>
          오름차순
        </Button>
      </Grid>
      <Grid container columnSpacing={2}>
        {/* 기업 사용 정보 데이터 영역 */}
        <Grid item xs={8}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  {dataTable.map(function (eachdata) {
                    return (
                      <StyledTableCell key={eachdata} align="center">
                        {eachdata}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {userCompanyUsageData.map(eachdata => (
                  <StyledTableRow key={eachdata.corp_code}>
                    <StyledTableCell align="center" component="th" scope="row">
                      {eachdata.corp_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {eachdata.memberSearchCounting || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {eachdata.nonMemberSearchCounting || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {eachdata.totalSearchCounting || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">{eachdata.watchCounting || 0}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.memoCounting || 0}</StyledTableCell>
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
                  <Grid
                    key={eachdata}
                    container
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: '10px' }}
                  >
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
                            name={searchInputNameArray[index][0]}
                            value={searchInputArray[index][0]}
                            sx={{ width: 0.45 }}
                          />
                          &nbsp;-&nbsp;
                          <TextField
                            onChange={onChangeSearchInput}
                            name={searchInputNameArray[index][1]}
                            value={searchInputArray[index][1]}
                            sx={{ width: 0.45 }}
                          />
                        </Grid>
                      ) : (
                        <TextField
                          fullWidth
                          onChange={onChangeSearchInput}
                          name={searchInputNameArray[index]}
                          value={searchInputArray[index]}
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
                onClick={searchUserCompanyUsage}
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

            {/* 필터링2 - 검색 유효기간 */}
            <OutLinedBox sx={{ mt: '30px' }}>
              <Grid container alignItems="flex-start" sx={{ mb: '10px' }}>
                <Typography fontSize="17px" fontWeight="600">
                  검색 유효기간 설정
                </Typography>
              </Grid>
              <Grid container alignItems="center" spacing={1} sx={{ mb: '10px' }}>
                <Grid item xs={2.3}>
                  <Typography component="div" fontSize={14} align="left">
                    <Box sx={{ my: '10px' }}>기업 검색 기간</Box>
                  </Typography>
                </Grid>
                <Grid item xs={7.2}>
                  <Grid container alignItems="center" sx={{ my: '10px' }}>
                    <TextField
                      onChange={onChangeSearchInput}
                      name={searchInputNameArray[3][0]}
                      value={searchInputArray[3][0]}
                      sx={{ width: 0.45 }}
                    />
                    &nbsp;-&nbsp;
                    <TextField
                      onChange={onChangeSearchInput}
                      name={searchInputNameArray[3][1]}
                      value={searchInputArray[3][1]}
                      sx={{ width: 0.45 }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={2.2}>
                  <Button
                    onClick={searchUserCompanyUsage}
                    variant="contained"
                    color="secondary"
                    sx={{ px: 0.5 }}
                  >
                    검색
                  </Button>
                </Grid>
              </Grid>
            </OutLinedBox>
          </FixedBox>
        </Grid>
      </Grid>
      <Pagination page={page} totalItem={totalItem} setPage={setPage} />
    </div>
  );
}
