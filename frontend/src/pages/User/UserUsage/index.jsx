import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
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

export default function UserUsage() {
  // 데이터 정렬 기준 선택
  const sortFieldList = [
    '가입일',
    '최근 접속일',
    '기업 검색 횟수',
    '관심목록 그룹 수',
    '작성 메모 수',
  ];
  const [sortField, setSortField] = useState('가입일');
  const [sortType, setSortType] = useState('내림차순');

  // 유저 사용 정보 관련
  const dataTable = [
    '닉네임',
    '가입일',
    '최근 접속일',
    '기업 검색 횟수',
    '관심목록 그룹 수',
    '관심목록 기업 수',
    '작성메모 수',
  ];
  const [userUsageData, setUserUsageData] = useState([]);

  // 노출 조건 관련
  const searchField = ['닉네임', '가입 기간', '접속 기간'];
  const [searchInput, setSearchInput] = useState({
    searchNickName: '',
    searchRegisterStart: '',
    searchRegisterEnd: '',
    searchConnectStart: '',
    searchConnectEnd: '',
    searchCompanyStart: '',
    searchCompanyEnd: '',
  });
  const {
    searchNickName,
    searchRegisterStart,
    searchRegisterEnd,
    searchConnectStart,
    searchConnectEnd,
    searchCompanyStart,
    searchCompanyEnd,
  } = searchInput;
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(true);

  const searchInputArray = [
    searchNickName,
    [searchRegisterStart, searchRegisterEnd],
    [searchConnectStart, searchConnectEnd],
    [searchCompanyStart, searchCompanyEnd],
  ];

  const searchInputNameArray = [
    'searchNickName',
    ['searchRegisterStart', 'searchRegisterEnd'],
    ['searchConnectStart', 'searchConnectEnd'],
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
        .get(`${url}/admin/user/userUsage/getData/all/${page}/${sortField}/${sortType}`)
        .then(result => {
          // console.log(result.data);
          setUserUsageData(result.data);
          setIsSearch(false);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userUsage/getData/search/${page}/${sortField}/${sortType}`, {
          params: searchInput,
        })
        .then(result => {
          // console.log(result.data);
          setUserUsageData(result.data);
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
        .get(`${url}/admin/user/userUsage/getTotalNum/all`)
        .then(result => {
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userUsage/getTotalNum/search`, {
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
    setUserUsageData([]);
    setPage(1);
    setSortField(e.target.value);
  };

  // 내림/오름차순 선택
  const selectSortType = () => {
    setUserUsageData([]);
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
  const searchUserUsage = () => {
    if (searchInput.length === 0) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
    setPage(1);
    setUserUsageData([]);
    setRefreshSwitch(!refreshSwitch);
  };

  // 노출 조건 부분 초기화
  const onPartsReset = ind => {
    if (ind === 0) {
      setSearchInput({
        ...searchInput,
        searchNickName: '',
      });
    } else if (ind === 1) {
      setSearchInput({
        ...searchInput,
        searchRegisterStart: '',
        searchRegisterEnd: '',
      });
    } else {
      setSearchInput({
        ...searchInput,
        searchConnectStart: '',
        searchConnectEnd: '',
      });
    }
  };

  // 노출 조건 전체 초기화
  const onAllReset = () => {
    setSearchInput({
      searchNickName: '',
      searchRegisterStart: '',
      searchRegisterEnd: '',
      searchConnectStart: '',
      searchConnectEnd: '',
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
        {/* UserUsage 데이터 영역 */}
        <Grid item xs={8}>
          <TableContainer component={Paper} sx={{ maxHeight: { md: '545px', xl: '885px' } }}>
            <Table stickyHeader>
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
                {userUsageData.map(eachdata => (
                  <StyledTableRow key={eachdata.id}>
                    <StyledTableCell align="center" component="th" scope="row">
                      {eachdata.NickName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {changeDate(eachdata.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {changeDate(eachdata.updatedAt)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{eachdata.searchCounting || 0}</StyledTableCell>
                    <StyledTableCell align="center">
                      {eachdata.watchGroupCounting || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {eachdata.watchCompanyCounting || 0}
                    </StyledTableCell>
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
                onClick={searchUserUsage}
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
                    onClick={searchUserUsage}
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

function changeDate(date) {
  const publishDate = moment(date).format('YYYY.MM.DD');
  return publishDate;
}
