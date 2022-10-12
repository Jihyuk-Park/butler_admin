import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';

import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import { url } from '../../../component/commonVariable';
import DropDown from '../../../component/UI/DropDown';

export default function UserEntire() {
  // 데이터 정렬 기준 관련
  const sortTypeList = ['일간', '월간'];
  const [sortType, setSortType] = useState('일간');

  // 전체 유저 정보 데이터 관련
  const dataTable = [
    '일자',
    `네이버 ${sortType} 가입자`,
    `카카오 ${sortType} 가입자`,
    '일간 가입자 합계',
    '네이버 누적 가입자',
    '카카오 누적 가입자',
    '누적 가입자 통계',
  ];
  const [entireUserData, setEntireData] = useState([]);

  // 정렬 기준에 따라 전체 유저 정보를 받아오는 Hook
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

  // 데이터 정렬 기준 선택
  const selectSortType = e => {
    setEntireData([]);
    setSortType(e.target.value);
  };

  return (
    <div>
      {/* 정렬 영역  */}
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        <DropDown
          value={sortType}
          label="정렬 타입"
          onChange={selectSortType}
          selectList={sortTypeList}
        />
      </Grid>

      {/* 전체 유저 정보 영역 */}
      <TableContainer component={Paper} sx={{ maxHeight: { md: '630px', xl: '940px' } }}>
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
