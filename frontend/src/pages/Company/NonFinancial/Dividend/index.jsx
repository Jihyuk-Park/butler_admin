import React, { useState } from 'react';
import axios from 'axios';
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
import { url } from '../../../../component/constVariable';
import CompanyEditModal from '../../../../component/UI/CompanyEditModal';

export default function Dividend() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // 편집 모달
  const [editButtonSwitch, setEditButtonSwtich] = useState(false);
  const [editModalSwtich, setEditModalSwitch] = useState(false);

  // dividnedData
  const [dividendData, setDividendData] = useState([{}]);
  const dividendAccountArray = [
    '주당액면가액(원)',
    '(연결)당기순이익(백만원)',
    '(별도)당기순이익(백만원)',
    '(연결)주당순이익(원)',
    '현금배당금총액(백만원)',
    '주식배당금총액(백만원)',
    '(연결)현금배당성향(%)',
    '보통주 주당 현금배당금(원)',
    '보통주 수정주당배당금',
    '보통주 현금배당수익률(%)',
    '보통주 주당 주식배당(주)',
    '보통주 주식배당수익률(%)',
    '우선주 주당 현금배당금(원)',
    '우선주 수정주당배당금',
    '우선주 현금배당수익률(%)',
    '우선주 주당 주식배당(주)',
    '우선주 주식배당수익률(%)',
    '배당(분기)',
  ];
  const calculationArray = [
    '현금배당금',
    '분기 배당금',
    '분기 배당수익율',
    '배당금총액(보고)',
    '분기EPS',
    '배당성향',
    '우선주 주당배당금(원)',
    '우선주 수정주당배당금',
    '우선주 현금배당수익율(%)',
    '배당(최근4분기)',
    '1년 배당금',
    '1년 배당수익율',
    '현금배당금총액',
    '1년 EPS',
    '1년 배당성향(순이익대비)',
    '1년 FCFPS',
    '배당성향(FCF대비)',
    '우선주 수정주당배당금',
    '우선주 배당수익율(%)',
  ];

  const searchData = () => {
    axios
      .get(`${url}/admin/company/nonFinancial/dividend/getData/all/${searchCompanyCode}`)
      .then(result => {
        // console.log(result.data);
        setDividendData(result.data);
        setEditButtonSwtich(true);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  const openEditModal = () => {
    setEditModalSwitch(true);
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body" sx={{ ml: '10px' }}>
            기업명
          </Typography>
          <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          disabled={editButtonSwitch === false}
          onClick={openEditModal}
          sx={{ minWidth: '90px' }}
        >
          편집
        </Button>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: '10px' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {['배당', ...periodArray].map(function (eachdata) {
                return (
                  <StyledTableCell key={eachdata} align="center">
                    {eachdata}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {dividendAccountArray.map(function (eachdata) {
              let temp = {};
              dividendData.forEach(val => {
                if (val.name === eachdata) {
                  temp = val;
                  // console.log(val.name);
                }
              });

              return (
                <StyledTableRow key={eachdata}>
                  <StyledTableCell align="center">{eachdata}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q115}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q215}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q315}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q415}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q116}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q216}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q316}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q416}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q117}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q217}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q317}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q417}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q118}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q218}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q318}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q418}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q119}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q219}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q319}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q419}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q120}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q220}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q320}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q420}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q121}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q221}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q321}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q421}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q122}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q222}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q322}</StyledTableCell>
                  <StyledTableCell align="center">{temp.Q422}</StyledTableCell>
                </StyledTableRow>
              );
            })}

            {calculationArray.map(function (eachdata) {
              return (
                <StyledTableRow key={eachdata}>
                  <StyledTableCell align="center">{eachdata}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q115}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q215}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q315}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q415}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q116}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q216}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q316}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q416}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q117}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q217}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q317}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q417}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q118}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q218}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q318}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q418}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q119}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q219}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q319}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q419}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q120}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q220}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q320}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q420}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q121}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q221}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q321}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q421}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q122}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q222}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q322}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Q422}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {editModalSwtich === false ? null : (
        <CompanyEditModal
          editModalSwtich={editModalSwtich}
          setEditModalSwitch={setEditModalSwitch}
          editAccountArray={dividendAccountArray}
          where="admin/company/nonFinancial/dividend"
          searchCompanyCode={searchCompanyCode}
          refreshFunction={searchData}
        />
      )}
    </div>
  );
}
