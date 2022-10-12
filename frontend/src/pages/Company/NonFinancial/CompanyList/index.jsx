import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
} from '@mui/material';
import OutLinedBox from '../../../../component/UI/OutLinedBox';
import { itemNumber, url } from '../../../../component/constVariable';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';

export default function CompanyList() {
  // 데이터 정렬 기준 선택
  const sortFieldList = ['기업명', '종목코드', 'Corpcode', '시장', '업종1', '업종2', '업종3'];
  const [sortField, setSortField] = useState('기업명');
  const [sortType, setSortType] = useState('내림차순');

  // 기업 목록 데이터 관련
  const dataTable = ['기업명', '종목코드', 'Corpcode', '시장', '업종1', '업종2', '업종3', 'IR주소'];
  const [companyListData, setCompanyListData] = useState([]);

  // 무한 스크롤 관련
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(100);

  // 사업 보고서 영역
  const yearArray = ['2017', '2018', '2019', '2020', '2021', '2022'];
  const quarterArray = ['1Q', '2Q', '3Q', '4Q'];
  const [businessReportInput, setBusinessReportInput] = useState({
    startYear: '2020',
    startQuarter: '1Q',
    endYear: '2022',
    endQuarter: '4Q',
  });
  const { startYear, startQuarter, endYear, endQuarter } = businessReportInput;
  const businessReportInputArray = [startYear, startQuarter, endYear, endQuarter];
  const businessReportInputNameArray = ['startYear', 'startQuarter', 'endYear', 'endQuarter'];

  // 노출 조건 설정, 기업 정보 수정
  const searchField = ['기업명', '사람', '업종1', '업종2', '업종3', '검색 키워드'];
  const companyInfoEdit = ['IR 주소', '키워드'];
  const [searchInput, setSearchInput] = useState({
    searchCompanyName: '',
    searchMarket: '',
    searchIndustry1: '',
    searchIndustry2: '',
    searchIndustry3: '',
    searchKeyword: '',
    editIRAdress: '',
    editKeyWord: '',
  });
  const {
    searchCompanyName,
    searchMarket,
    searchIndustry1,
    searchIndustry2,
    searchIndustry3,
    searchKeyword,
    editIRAdress,
    editKeyWord,
  } = searchInput;
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(true);

  const searchInputArray = [
    searchCompanyName,
    searchMarket,
    searchIndustry1,
    searchIndustry2,
    searchIndustry3,
    searchKeyword,
    editIRAdress,
    editKeyWord,
  ];
  const searchInputNameArray = [
    'searchCompanyName',
    'searchMarket',
    'searchIndustry1',
    'searchIndustry2',
    'searchIndustry3',
    'searchKeyword',
    'editIRAdress',
    'editKeyWord',
  ];

  // 유저 정보 데이터를 받아오는 Hook
  // 검색 유무에 따라 전체 데이터 혹은 일치하는 데이터
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(
          `${url}/admin/company/nonFinancial/companyList/getData/all/${page}/${sortField}/${sortType}`,
        )
        .then(result => {
          console.log(result.data);
          setCompanyListData([...companyListData, ...result.data]);
          setLoading(false);
          setIsSearch(false);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      // 임시용 삭제 예정
      setRefreshSwitch(refreshSwitch);
      axios
        .get(
          `${url}/admin/company/nonFinancial/companyList/getData/search/${page}/${sortField}/${sortType}`,
          {
            params: searchInput,
          },
        )
        .then(result => {
          // console.log(result.data);
          setCompanyListData([...companyListData, ...result.data]);
          setLoading(false);
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
        .get(`${url}/admin/company/nonFinancial/companyList/getTotalNum/all`)
        .then(result => {
          setMaxPage(Math.ceil(result.data.totalnum / itemNumber));
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      // eslint-disable-next-line object-shorthand
      const body = {};
      axios
        .get(`${url}/admin/user/userDailyCompany/getTotalNum/search`, {
          params: body,
        })
        .then(result => {
          // console.log(result.data);
          setMaxPage(Math.ceil(result.data.totalnum / itemNumber));
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [isSearch, refreshSwitch]);

  // 무한 스크롤 훅 (하단 도달 시 페이지 갱신(+1))
  useEffect(() => {
    if (inView && !loading && page < maxPage && companyListData.length !== 0) {
      setLoading(true);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  }, [inView, loading]);

  // 데이터 정렬 타입 선택
  const selectField = e => {
    setCompanyListData([]);
    setPage(1);
    setSortField(e.target.value);
  };

  // 내림/오름차순 선택
  const selectSortType = () => {
    setCompanyListData([]);
    setPage(1);
    if (sortType === '내림차순') {
      setSortType('오름차순');
    } else {
      setSortType('내림차순');
    }
  };

  // 사업보고서 기간 설정 input 관리
  const onChangeCompanyReport = e => {
    console.log(e);
    const { name, value } = e.target;
    console.log(name, value);
    setBusinessReportInput({
      ...businessReportInput,
      [name]: value,
    });
  };

  // 노출 조건 설정, 기업 정보 수정 input 관리
  const onChangeSearchInput = e => {
    const { name, value } = e.target;
    setSearchInput({
      ...searchInput,
      [name]: value,
    });
  };

  const onAllReset = () => {
    setSearchInput({
      searchCompanyName: '',
      searchMarket: '',
      searchIndustry1: '',
      searchIndustry2: '',
      searchIndustry3: '',
      searchKeyword: '',
      editIRAdress,
      editKeyWord,
    });
  };

  const onPartsReset = ind => {
    console.log(searchInputArray[ind]);
    setSearchInput({
      ...searchInput,
      [searchInputNameArray[ind]]: '',
    });
  };

  return (
    <div>
      {/* 정렬 영역  */}
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        <FormControl sx={{ mr: '15px' }}>
          <InputLabel>정렬 타입</InputLabel>
          <Select value={sortField} label="정렬 타입" onChange={selectField}>
            {sortFieldList.map(function (eachdata) {
              return (
                <MenuItem key={eachdata} value={eachdata}>
                  {eachdata}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button onClick={selectSortType} color={sortType === '내림차순' ? 'primary' : 'inactive'}>
          내림차순
        </Button>
        <Button onClick={selectSortType} color={sortType === '오름차순' ? 'primary' : 'inactive'}>
          오름차순
        </Button>
      </Grid>
      <Grid container columnSpacing={2}>
        {/* CompanyList 데이터 영역 */}
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
                {companyListData.map(eachdata => (
                  <StyledTableRow key={eachdata.corp_code}>
                    <StyledTableCell align="center" component="th" scope="row">
                      <Button color="secondary">{eachdata.corp_name}</Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">{eachdata.stock_code}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.corp_code}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.market_code}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.AuthType}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.ir_url}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box ref={ref} sx={{ height: '10px', mt: '30px' }} />
        </Grid>

        <Grid item xs={4}>
          {/* 사업보고서 영역 */}
          <OutLinedBox sx={{ pt: '15px', pb: '5px' }}>
            <Grid container spacing={1} sx={{ mb: '10px' }}>
              <Grid item xs={2.3}>
                <Typography component="div" fontSize={13} align="left">
                  <Box sx={{ my: '20px' }}>업데이트</Box>
                  <Box sx={{ my: '25px' }}>사업보고서</Box>
                </Typography>
              </Grid>
              <Grid item xs={9.7}>
                <Grid container alignItems="center">
                  <Grid container direction="row" justifyContent="space-between">
                    <Button
                      onClick={() => {}}
                      variant="contained"
                      color="secondary"
                      sx={{ color: '#FFFFFF', my: '10px', width: 0.48 }}
                    >
                      기업 목록
                    </Button>
                    <Button
                      onClick={() => {}}
                      variant="contained"
                      color="secondary"
                      sx={{ color: '#FFFFFF', my: '10px', width: 0.48 }}
                    >
                      전일 종가 파일
                    </Button>
                  </Grid>
                  <Stack direction="row">
                    {quarterArray.map(function (each, index) {
                      return (
                        <div key={`${each}기간 영역`}>
                          {index % 2 === 0 ? (
                            <Select
                              name={businessReportInputNameArray[index]}
                              value={businessReportInputArray[index]}
                              label="기간"
                              onChange={onChangeCompanyReport}
                              SelectDisplayProps={{
                                style: {
                                  padding: '5px 30px 5px 10px',
                                  backgroundColor: '#FFF',
                                  fontSize: '12px',
                                },
                              }}
                              sx={{ mx: '2px' }}
                            >
                              {yearArray.map(function (eachdata) {
                                return (
                                  <MenuItem key={eachdata} value={eachdata}>
                                    {eachdata}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          ) : (
                            <Select
                              name={businessReportInputNameArray[index]}
                              value={businessReportInputArray[index]}
                              label="기간"
                              onChange={onChangeCompanyReport}
                              SelectDisplayProps={{
                                style: {
                                  padding: '5px 30px 5px 10px',
                                  backgroundColor: '#FFF',
                                  fontSize: '12px',
                                },
                              }}
                              sx={{ mx: '2px' }}
                            >
                              {quarterArray.map(function (eachdata) {
                                return (
                                  <MenuItem key={eachdata} value={eachdata}>
                                    {eachdata}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          {index === 1 ? '-' : null}
                        </div>
                      );
                    })}
                  </Stack>
                </Grid>
                <Button
                  onClick={() => {}}
                  fullWidth
                  color="secondary"
                  variant="contained"
                  sx={{ color: '#FFFFFF', my: '10px' }}
                >
                  업데이트
                </Button>
              </Grid>
            </Grid>
          </OutLinedBox>

          {/* 필터링 - 노출 조건 설정 */}
          <OutLinedBox sx={{ pt: '15px', my: '30px' }}>
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
                    <TextField
                      fullWidth
                      onChange={onChangeSearchInput}
                      name={searchInputNameArray[index]}
                      value={searchInputArray[index]}
                    />
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
              onClick={() => {}}
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

          {/* 기업 정보 수정 */}
          <OutLinedBox>
            <Grid container alignItems="flex-start" sx={{ mb: '10px' }}>
              <Typography fontSize="17px" fontWeight="600">
                IR 정보 수정
              </Typography>
            </Grid>
            {companyInfoEdit.map(function (eachdata, index) {
              return (
                <Grid key={eachdata} container alignItems="center" spacing={1} sx={{ mb: '10px' }}>
                  <Grid item xs={2.3}>
                    <Typography component="div" fontSize={14} align="left">
                      {eachdata}
                    </Typography>
                  </Grid>
                  <Grid item xs={7.2}>
                    <Grid container alignItems="center">
                      <TextField
                        fullWidth
                        onChange={onChangeSearchInput}
                        name={searchInputNameArray[index + 6]}
                        value={searchInputArray[index + 6]}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={2.2}>
                    <Button
                      onClick={() => onPartsReset(index + 6)}
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
              onClick={() => {}}
              fullWidth
              variant="contained"
              sx={{ color: '#FFFFFF', my: '10px' }}
            >
              저장
            </Button>
            <Button onClick={onAllReset} fullWidth variant="contained" color="secondary">
              취소
            </Button>
          </OutLinedBox>
        </Grid>
      </Grid>
    </div>
  );
}
