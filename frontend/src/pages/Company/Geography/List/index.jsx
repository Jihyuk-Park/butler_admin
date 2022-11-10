import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { url } from '../../../../component/commonVariable';
import { changeDateDash, addComma } from '../../../../component/commonFunction';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import Pagination from '../../../../component/Pagination';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';

export default function GeographyList() {
  const navigate = useNavigate();

  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');
  // 초기화 시, 자료 목록 업데이트를 위한(useEffect 훅 동작) state 및 데이터 수정 시
  const [refreshSwitch, setRefreshSwitch] = useState(true);
  // 초기화 시, 자동입력 삭제를 위한 state
  const [clearSwitch, setClearSwitch] = useState(0);

  // 데이터 정렬 기준 선택
  const [sortField, setSortField] = useState('주식코드');
  const [sortType, setSortType] = useState('▲');

  // 기업 목록 데이터 관련
  const dataTable = [
    '번호',
    '기업명',
    '주식코드',
    '최근 작업일',
    '최근파일',
    '정보1',
    '정보2',
    '소스',
    '통화',
    '단위',
    '서비스여부',
  ];
  const [companyListData, setCompanyListData] = useState([]);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(100);

  // 기업목록 데이터를 받아오는 Hook
  useEffect(() => {
    axios
      .get(`${url}/admin/company/geography/list/getData/all/${page}/${sortField}/${sortType}`)
      .then(result => {
        // console.log(result.data);
        setCompanyListData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [page, sortField, sortType, refreshSwitch]);

  // 전체 페이지 수 계산을 위한 Hook (페이지네이션)
  useEffect(() => {
    axios
      .get(`${url}/admin/company/geography/list/getTotalNum/all`)
      .then(result => {
        setTotalItem(result.data.totalnum);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [refreshSwitch]);

  // 기업 검색
  const searchData = () => {
    axios
      .get(`${url}/admin/company/geography/list/getData/search/${searchCompanyCode}`)
      .then(result => {
        // console.log(result.data);
        setCompanyListData(result.data);
        setTotalItem(1);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  // 검색 초기화 (전체 기업 목록)
  const resetSearch = () => {
    setPage(1);
    setRefreshSwitch(!refreshSwitch);
    setClearSwitch(clearSwitch + 1);
  };

  const sortData = field => {
    if (field !== '번호') {
      if (sortField !== field && totalItem !== 1) {
        setSortField(field);
      } else if (sortField === field && totalItem !== 1) {
        if (sortType === '▲') {
          setSortType('▼');
        } else {
          setSortField('주식코드');
          setSortType('▲');
        }
      }
    }
  };

  const goToIndividual = code => {
    navigate(`/Company/Geography/Individual/${code}`);
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete
            onChangeCompanyCode={setSearchCompanyCode}
            clearSwitch={clearSwitch}
            minWidth="300px"
            enterFunc={searchData}
          />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
          <Button
            variant="contained"
            color="inactive"
            onClick={resetSearch}
            sx={{ color: 'white' }}
          >
            초기화
          </Button>
        </Stack>
      </Grid>

      {/* IRCompanyList 데이터 영역 */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: { md: '545px', xl: '885px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {dataTable.map(function (eachdata) {
                return (
                  <StyledTableCell
                    key={eachdata}
                    onClick={() => {
                      sortData(eachdata);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {eachdata} {sortField === eachdata ? sortType : null}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {companyListData.map((eachdata, index) => (
              <StyledTableRow key={eachdata.corp_name}>
                <StyledTableCell sx={{ minWidth: 30, maxWidth: 30 }}>
                  {(page - 1) * 20 + index + 1}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 110, maxWidth: 110 }}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      goToIndividual(eachdata.corp_code);
                    }}
                    sx={{ p: 0 }}
                  >
                    <u>{eachdata.corp_name}</u>
                  </Button>
                </StyledTableCell>
                <StyledTableCell>{eachdata.stock_code}</StyledTableCell>
                <StyledTableCell>{changeDateDash(eachdata.recent)}</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {eachdata.geography_last_updated}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {eachdata.geography_title1}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {eachdata.geography_title2}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 120, maxWidth: 120, wordBreak: 'break-all' }}>
                  {eachdata.geography_source}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {eachdata.currency}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 40, maxWidth: 40 }}>
                  {eachdata.unit === null ? '' : addComma(eachdata.unit)}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {eachdata.is_available === 1 ? 'O' : 'X'}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination page={page} totalItem={totalItem} setPage={setPage} />
    </div>
  );
}
