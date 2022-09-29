import React, { useState, useEffect } from 'react';
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
import OutLinedBox from '../../component/UI/OutLinedBox';
import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';
import FixedBox from '../../component/UI/FixedBox';

export default function UserDailyUsage() {
  // 일별 전체 기업 정보 데이터 관련
  const dataTable = [
    '일자',
    '가입자의 기업 검색 횟수',
    '비 가입자의 기업 검색 횟수',
    '검색 횟수 총합',
    '관심목록 신규 유저 수',
    '관심목록 누적 유저 수',
  ];
  const [companyUsageData, setCompanyUsageData] = useState([]);

  // 노출 조건 설정
  const searchField = ['기업명', '검색 횟수', '관심 목록 유저 수'];
  const [searchInput, setSearchInput] = useState({
    searchCompanyName: '',
    searchCountingStart: '',
    searchCountingEnd: '',
    searchUserCountingStart: '',
    searchUserCountingEnd: '',
  });
  const {
    searchCompanyName,
    searchCountingStart,
    searchCountingEnd,
    searchUserCountingStart,
    searchUserCountingEnd,
  } = searchInput;

  const searchInputArray = [
    searchCompanyName,
    [searchCountingStart, searchCountingEnd],
    [searchUserCountingStart, searchUserCountingEnd],
  ];

  const searchInputNameArray = [
    'searchCompanyName',
    ['searchCountingStart', 'searchCountingEnd'],
    ['searchUserCountingStart', 'searchUserCountingEnd'],
  ];

  // 곧 지울 것 임시
  useEffect(() => {
    console.log(setCompanyUsageData);
  }, []);

  // 노출 조건 입력 input
  const onChangeSearchInput = e => {
    const { name, value } = e.target;
    setSearchInput({
      ...searchInput,
      [name]: value,
    });
  };

  // 노출 조건 부분 리센
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

  // 노출 조건 전체 리셋
  const onAllReset = () => {
    setSearchInput({
      searchCompanyName: '',
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
              {companyUsageData.map(eachdata => (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell align="center" component="th" scope="row">
                    <Button color="secondary">{eachdata.NickName}</Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Name}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Phone}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.EMail}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.AuthType}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
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
        </FixedBox>
      </Grid>
    </Grid>
  );
}
