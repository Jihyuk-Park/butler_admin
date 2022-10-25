import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Button,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
} from '@mui/material';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import PeriodTableCell from '../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { url } from '../../../../component/commonVariable';
import { periodArrayAuto, scrollRightUseEffect } from '../../../../component/commonFunction';

export default function Stock() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // StockData
  const [stockData, setStockData] = useState([{}]);
  const stockAccountArray = [
    '최종거래일',
    '수정주가',
    '발행주식수(천주)',
    '자기주식수',
    '유통주식수',
    '보통주 시가총액',
  ];
  const periodArray = periodArrayAuto();

  scrollRightUseEffect();

  const searchData = () => {
    axios
      .get(`${url}/admin/company/otherInfo/stock/getData/search/${searchCompanyCode}`)
      .then(result => {
        // console.log(result.data);
        setStockData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
        </Stack>
      </Grid>
      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['(십억)', ...periodArray].map(function (eachdata, index) {
                return (
                  <StyledTableCell
                    key={eachdata}
                    align="center"
                    sx={[
                      index === 0
                        ? { minWidth: 180, position: 'sticky', left: 0, zIndex: 100 }
                        : null,
                    ]}
                  >
                    {eachdata}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {stockAccountArray.map(function (eachdata) {
              let temp = {};
              stockData.forEach(val => {
                if (val.name === eachdata) {
                  temp = val;
                  // console.log(val.name);
                }
              });

              return (
                <StyledTableRow key={eachdata}>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 180,
                      position: 'sticky',
                      left: 0,
                    }}
                  >
                    {eachdata}
                  </StyledTableCell>
                  <PeriodTableCell align="center">{temp.Q115}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q215}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q315}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q415}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q116}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q216}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q316}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q416}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q117}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q217}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q317}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q417}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q118}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q218}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q318}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q418}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q119}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q219}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q319}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q419}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q120}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q220}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q320}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q420}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q121}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q221}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q321}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q421}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q122}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q222}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q322}</PeriodTableCell>
                  <PeriodTableCell align="center">{temp.Q422}</PeriodTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
