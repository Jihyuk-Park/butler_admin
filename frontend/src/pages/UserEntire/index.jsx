import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';
import { url } from '../../component/constVariable';

export default function UserEntire() {
  const sortTypeList = ['일간', '월간'];
  // 메모 데이터 및 정렬
  const [entireUserData, setEntireData] = useState([]);
  const [sortType, setSortType] = useState('일간');

  const dataTable = [
    '일자',
    `네이버 ${sortType} 가입자`,
    `카카오 ${sortType} 가입자`,
    '일간 가입자 합계',
    '네이버 누적 가입자',
    '카카오 누적 가입자',
    '누적 가입자 통계',
  ];

  useEffect(() => {
    axios
      .get(`${url}/admin/user/userEntire/getData/${sortType}`)
      .then(result => {
        // console.log(result.data);
        setEntireData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [sortType]);

  const selectSortType = e => {
    setEntireData([]);
    setSortType(e.target.value);
  };

  return (
    <div>
      {/* 정렬 영역  */}
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        <FormControl sx={{ mr: '15px' }}>
          <InputLabel>정렬 타입</InputLabel>
          <Select value={sortType} label="정렬 타입" onChange={selectSortType}>
            {sortTypeList.map(function (eachdata) {
              return (
                <MenuItem key={eachdata} value={eachdata}>
                  {eachdata}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      {/* 메모 데이터 영역 */}
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
            {entireUserData.map(function (eachdata) {
              return (
                <StyledTableRow key={eachdata.date}>
                  <StyledTableCell align="center">
                    {changeDate(eachdata.date, sortType)}
                  </StyledTableCell>
                  <StyledTableCell align="center">{eachdata.NAVER}</StyledTableCell>
                  <StyledTableCell align="center">
                    {eachdata.daily - eachdata.NAVER}
                  </StyledTableCell>
                  <StyledTableCell align="center">{eachdata.daily}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.TOTAL_NAVER}</StyledTableCell>
                  <StyledTableCell align="center">
                    {eachdata.TOTAL_Daily - eachdata.TOTAL_NAVER}
                  </StyledTableCell>
                  <StyledTableCell align="center">{eachdata.TOTAL_Daily}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function changeDate(date, sortType) {
  let publishDate;
  if (sortType === '일간') {
    publishDate = moment(date).format('YYYY.MM.DD (dd)');
  } else {
    publishDate = moment(date).format('YYYY.MM');
  }
  return publishDate;
}
