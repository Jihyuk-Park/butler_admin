import React, { useState } from 'react';
import {
  Grid,
  Button,
  Stack,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
} from '@mui/material';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { periodArray } from '../../../../component/constVariable';

export default function Stock() {
  // AutoComplete 회사 corp_code
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // stockData
  const [stockData, setStockData] = useState([{}]);
  console.log(searchCompanyCode, setStockData);

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body" sx={{ ml: '10px' }}>
            기업명
          </Typography>
          <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
          <Button variant="contained" color="secondary">
            검색
          </Button>
        </Stack>
        <Button variant="contained" color="secondary" sx={{ minWidth: '90px' }}>
          편집
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {['주식(십억)', ...periodArray].map(function (eachdata) {
                return (
                  <StyledTableCell key={eachdata} align="center">
                    {eachdata}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map(function (eachdata) {
              return (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.created_at}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.updated_at}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.corp_name}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.NickName}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.type}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.memo}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
