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
  scrollRight,
  periodArrayAuto,
  addComma,
  changeKeyName,
} from '../../../../component/commonFunction';
import CompanyEditModal from '../../../../component/UI/CompanyEditModal';

export default function MinorityShareHolders() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // 편집 모달
  const [editButtonSwitch, setEditButtonSwtich] = useState(false);
  const [editModalSwtich, setEditModalSwitch] = useState(false);

  // buybackData
  const [minorityShareHoldersData, setMinorityShareHoldersData] = useState([{}]);
  const minorityShareHoldersAccountArray = [
    '주주 수',
    '전체 주주 수',
    '주주 비율(%)',
    '보유 주식 수',
    '총 발행 주식 수',
    '보유 주식 비율(%)',
  ];
  const periodArray = periodArrayAuto();

  scrollRight();

  const searchData = () => {
    axios
      .get(
        `${url}/admin/company/otherInfo/minorityShareHolders/getData/search/${searchCompanyCode}`,
      )
      .then(result => {
        // console.log(result.data);
        setMinorityShareHoldersData(result.data);
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
              {['소액주주 내역', ...periodArray].map(function (eachdata, index) {
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
            {minorityShareHoldersAccountArray.map(function (eachdata) {
              // 이름이 대응되는 곳에 값 대입
              let temp = {};
              minorityShareHoldersData.forEach(val => {
                if (val.se === eachdata) {
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
          </TableBody>
        </Table>
      </TableContainer>
      {editModalSwtich === false ? null : (
        <CompanyEditModal
          editModalSwtich={editModalSwtich}
          setEditModalSwitch={setEditModalSwitch}
          editAccountArray={minorityShareHoldersAccountArray}
          where="admin/company/otherInfo/minorityShareHolders"
          isAccountFieldExist={false}
          searchCompanyCode={searchCompanyCode}
          // 데이터 리프레시를 위한 검색 함수 (수정완료 후 자동으로 호출 할)
          refreshFunction={searchData}
        />
      )}
    </div>
  );
}
