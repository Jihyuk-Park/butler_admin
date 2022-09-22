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
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
} from '@mui/material';
import OutLinedBox from '../../component/UI/OutLinedBox';
import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';

export default function UserInfo() {
  const [userInfoData, setUserInfoData] = useState([]);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(10);
  const dataTable = ['닉네임', '이름', '전화번호', '이메일', '로그인 방식', 'Grade', 'Type', 'Uid'];
  const searchTypeList = ['닉네임', '이름', '로그인 방식', 'Grade', 'Type', 'Uid'];
  const [searchType, setSearchType] = useState('닉네임');

  useEffect(() => {
    axios
      .get(`/admin/user/UserInfo/get/${page}`)
      .then(result => {
        // console.log(result.data);
        setUserInfoData([...userInfoData, ...result.data]);
        setLoading(false);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [page]);

  useEffect(() => {
    axios
      .get(`/admin/user/UserInfo/getTotalNum`)
      .then(result => {
        // console.log(result.data);
        setMaxPage(Math.ceil(result.data.totalnum / 12));
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, []);

  useEffect(() => {
    if (inView && !loading && page <= maxPage && userInfoData.length !== 0) {
      setLoading(true);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  }, [inView, loading]);

  const selectType = e => {
    setSearchType(e.target.value);
  };

  return (
    <Grid container columnSpacing={1}>
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
              {userInfoData.map(eachdata => (
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
        <Box ref={ref} sx={{ height: '10px', mt: '30px' }} />
      </Grid>
      <Grid item xs={4}>
        <Stack direction="row" spacing={1}>
          <FormControl>
            <InputLabel>검색타입</InputLabel>
            <Select value={searchType} label="검색 타입" onChange={selectType}>
              {searchTypeList.map(function (eachdata) {
                return (
                  <MenuItem key={eachdata} value={eachdata}>
                    {eachdata}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField fullWidth />
          <Button variant="contained" color="secondary">
            검색
          </Button>
        </Stack>
        <OutLinedBox>
          {dataTable.map(function (eachdata) {
            return (
              <Grid container alignItems="center" spacing={1} key={eachdata} sx={{ mb: '10px' }}>
                <Grid item xs={3}>
                  <Typography fontSize={14} align="left">
                    {eachdata}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField fullWidth />
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="secondary">
                    수정
                  </Button>
                </Grid>
              </Grid>
            );
          })}
          <Button fullWidth variant="contained" sx={{ color: '#FFFFFF', my: '10px' }}>
            저장
          </Button>
          <Button fullWidth variant="contained" color="secondary">
            취소
          </Button>
        </OutLinedBox>
      </Grid>
    </Grid>
  );
}
