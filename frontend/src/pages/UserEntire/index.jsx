import React, { useState, useEffect } from 'react';
import 'moment/locale/ko';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';

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
    console.log(setEntireData, setSortType);
  }, []);

  const selectSortType = e => {
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
            {entireUserData.map(eachdata => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.created_at}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.updated_at}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.corp_name}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.NickName}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.type}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.memo}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button variant="contained" color="secondary">
                    삭제
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
