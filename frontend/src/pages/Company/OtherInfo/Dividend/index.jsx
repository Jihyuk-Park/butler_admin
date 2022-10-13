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
import { periodArray } from '../../../../component/commonVariable';
import { url } from '../../../../component/commonVariable';
import { scrollRight } from '../../../../component/commonFunction';
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

  scrollRight();

  const searchData = () => {
    axios
      .get(`${url}/admin/company/otherInfo/dividend/getData/all/${searchCompanyCode}`)
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
      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['배당', ...periodArray].map(function (eachdata, index) {
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

            {calculationArray.map(function (eachdata) {
              return (
                <StyledTableRow key={eachdata}>
                  <PeriodTableCell
                    align="center"
                    sx={{
                      minWidth: 180,
                      position: 'sticky',
                      left: 0,
                    }}
                  >
                    {eachdata}
                  </PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q115}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q215}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q315}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q415}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q116}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q216}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q316}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q416}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q117}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q217}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q317}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q417}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q118}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q218}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q318}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q418}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q119}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q219}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q319}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q419}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q120}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q220}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q320}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q420}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q121}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q221}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q321}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q421}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q122}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q222}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q322}</PeriodTableCell>
                  <PeriodTableCell align="center">{eachdata.Q422}</PeriodTableCell>
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
          where="admin/company/otherInfo/dividend"
          searchCompanyCode={searchCompanyCode}
          // 데이터 리프레시를 위한 검색 함수 (수정완료 후 자동으로 호출 할)
          refreshFunction={searchData}
        />
      )}
    </div>
  );
}
