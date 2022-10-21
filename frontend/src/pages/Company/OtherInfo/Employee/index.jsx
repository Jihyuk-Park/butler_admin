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
import {
  periodArrayAuto,
  addComma,
  changeKeyName,
  scrollRightUseEffect,
} from '../../../../component/commonFunction';
import CompanyEditModal from '../../../../component/UI/CompanyEditModal';

export default function Employee() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // 편집 모달
  const [editButtonSwitch, setEditButtonSwtich] = useState(false);
  const [editModalSwtich, setEditModalSwitch] = useState(false);

  // buybackData
  const [employeeData, setEmployeeData] = useState([{}]);
  const employeeAccountArray = [
    '남',
    '근속연수',
    '급여총액(십억)',
    '1인평균(백만)',
    '여',
    '근속연수',
    '급여총액',
    '1인평균',
    '합계',
    '근속연수',
    '급여총액',
    '1인평균',
  ];
  const employeeAccountArrayQuarter = [
    '임직원(분기)',
    '인원수변화(남)',
    '급여총액(남)',
    '1인평균(남)',
    '인원수변화(여)',
    '......',
  ];
  const periodArray = periodArrayAuto();
  scrollRightUseEffect();

  const searchData = () => {
    axios
      .get(`${url}/admin/company/otherInfo/employee/getData/search/${searchCompanyCode}`)
      .then(result => {
        // console.log(result.data);
        setEmployeeData(result.data);
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
          sx={{ minWidth: '90px', mr: '10px' }}
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
              {['직원 내역', ...periodArray].map(function (eachdata, index) {
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
            {employeeAccountArray.map(function (eachdata) {
              // 이름이 대응되는 곳에 값 대입
              let temp = {};
              employeeData.forEach(val => {
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
                  {periodArray.map(function (period) {
                    return (
                      <PeriodTableCell align="center" key={`${eachdata}${period}`}>
                        {addComma(temp[changeKeyName(period)])}
                      </PeriodTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}

            {employeeAccountArrayQuarter.map(function (eachdata) {
              return (
                <StyledTableRow key={`Quarter_${eachdata}`}>
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
          editAccountArray={employeeAccountArray}
          where="admin/company/otherInfo/buyback"
          searchCompanyCode={searchCompanyCode}
          // 데이터 리프레시를 위한 검색 함수 (수정완료 후 자동으로 호출 할)
          refreshFunction={searchData}
        />
      )}
    </div>
  );
}
