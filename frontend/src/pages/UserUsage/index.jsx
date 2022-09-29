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
  Box,
  TextField,
  Typography,
} from '@mui/material';
import OutLinedBox from '../../component/UI/OutLinedBox';
import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';
import FixedBox from '../../component/UI/FixedBox';

export default function UserUsage() {
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

  // 무한 스크롤 관련
  // ~~ 지금은 없으니 생략
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

  // 곧 지울 것 임시
  useEffect(() => {
    console.log(setUserUsageData);
  }, []);

  // 노출 조건 입력 input
  const onChangeSearchInput = e => {
    const { name, value } = e.target;
    setSearchInput({
      ...searchInput,
      [name]: value,
    });
  };

  // 노출 조건 부분 reset
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

  // 노출 조건 reset
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
    <Grid container columnSpacing={2}>
      {/* UserUsage 데이터 영역 */}
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
              {userUsageData.map(eachdata => (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell align="center" component="th" scope="row">
                    <Button color="secondary">{eachdata.NickName}</Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Name}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Phone}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.EMail}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.AuthType}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
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
                <Button onClick={() => {}} variant="contained" color="secondary" sx={{ px: 0.5 }}>
                  검색
                </Button>
              </Grid>
            </Grid>
          </OutLinedBox>
        </FixedBox>
      </Grid>
    </Grid>
  );
}
