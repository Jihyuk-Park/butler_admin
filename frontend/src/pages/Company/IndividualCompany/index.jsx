import React, { useState } from 'react';
import axios from 'axios';
import {
  Table,
  Grid,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import { url } from '../../../component/commonVariable';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import CompanyListAutoComplete from '../../../component/CompanyListAutoComplete';

export default function IndividualCompany() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // 기업 목록 데이터 관련
  const dataTable = [
    '기업명',
    '주식코드',
    '기업코드',
    '시장',
    '업종1',
    '업종2',
    '업종3',
    'IR주소',
    '결산월',
    '키워드',
    '주재무제표',
  ];
  const [individualCompanyData, setIndividualCompanyData] = useState([]);

  // 기업 검색
  const searchData = () => {
    axios
      .get(`${url}/admin/company/individualCompany/getData/search/${searchCompanyCode}`)
      .then(result => {
        // console.log(result.data);
        setIndividualCompanyData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  const goToIR = link => {
    if (link.length !== 0) {
      if (link.substring(0, 3) === 'www') {
        window.open(`http://${link}`);
      } else {
        window.open(link);
      }
    }
  };

  const loadDartData = () => {
    console.log(searchCompanyCode);
  };

  const updateS3File = () => {
    console.log(searchCompanyCode);
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete
            enterFunc={searchData}
            onChangeCompanyCode={setSearchCompanyCode}
            minWidth="300px"
          />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={loadDartData}
            sx={{ minWidth: '90px' }}
          >
            기업정보 불러오기(DART)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={updateS3File}
            sx={{ minWidth: '90px' }}
          >
            기업파일 업데이트(S3)
          </Button>
        </Stack>
      </Grid>

      {/* CompanyList 데이터 영역 */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: { md: '545px', xl: '885px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {dataTable.map(function (eachdata) {
                return (
                  <StyledTableCell key={eachdata} align="center" sx={{ cursor: 'pointer' }}>
                    {eachdata}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {individualCompanyData.map(eachdata => (
              <StyledTableRow key={eachdata.corp_code}>
                <StyledTableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ minWidth: 105, maxWidth: 105 }}
                >
                  <u>{eachdata.corp_name}</u>
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.stock_code}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.corp_code}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.market_code}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ minWidth: 100, maxWidth: 100 }}>
                  {eachdata.induty1}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ minWidth: 100, maxWidth: 100 }}>
                  {eachdata.induty2}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ minWidth: 100, maxWidth: 100 }}>
                  {eachdata.induty3}
                </StyledTableCell>
                <StyledTableCell
                  onClick={() => goToIR(eachdata.ir_url)}
                  align="left"
                  sx={{ minWidth: 160, maxWidth: 160, wordBreak: 'break-all', cursor: 'pointer' }}
                >
                  <u>{eachdata.ir_url}</u>
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: { lg: 40, xl: 70 } }}>
                  {eachdata.Acc_mt}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ minWidth: { lg: 40, xl: 70 } }}>
                  {eachdata.keyword}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: { lg: 70, xl: 70 } }}>
                  {eachdata.fs_div === 'CFS' ? '연결' : '개별'}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
