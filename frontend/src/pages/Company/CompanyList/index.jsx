import React, { useState, useEffect } from 'react';
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
import Pagination from '../../../component/Pagination';
import CompanyListAutoComplete from '../../../component/CompanyListAutoComplete';
import EditModal from './EditModal';

export default function CompanyList() {
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
  const [companyListData, setCompanyListData] = useState([]);

  // 수정 모달
  const [editModalSwitch, setEditModalSwitch] = useState(false);
  const [editData, setEditData] = useState('');

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(100);

  // 기업목록 데이터를 받아오는 Hook
  useEffect(() => {
    axios
      .get(`${url}/admin/company/companyList/getData/all/${page}/${sortField}/${sortType}`)
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
      .get(`${url}/admin/company/companyList/getTotalNum/all`)
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
      .get(`${url}/admin/company/companyList/getData/search/${searchCompanyCode}`)
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

  const openEditModal = data => {
    setEditData(data);
    setEditModalSwitch(true);
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
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" color="secondary" sx={{ minWidth: '90px' }}>
            목록(DB) 업데이트
          </Button>
          <Button variant="contained" color="secondary" sx={{ minWidth: '90px' }}>
            파일(S3) 업데이트
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
              <StyledTableRow key={eachdata.corp_code}>
                <StyledTableCell align="center" sx={{ minWidth: 30, maxWidth: 30 }}>
                  {(page - 1) * 20 + index + 1}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 105, maxWidth: 105 }}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      openEditModal(eachdata);
                    }}
                    sx={{ p: 0 }}
                  >
                    <u>{eachdata.corp_name}</u>
                  </Button>
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.stock_code}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.corp_code}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
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
                <StyledTableCell sx={{ minWidth: { lg: 40, xl: 70 } }}>
                  {eachdata.Acc_mt}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ minWidth: { lg: 40, xl: 70 } }}>
                  {eachdata.keyword}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: { lg: 70, xl: 70 } }}>
                  {eachdata.fs_div === 'CFS' ? '연결' : '개별'}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination page={page} totalItem={totalItem} setPage={setPage} />

      {editModalSwitch === true ? (
        <EditModal
          editModalSwitch={editModalSwitch}
          setEditModalSwitch={setEditModalSwitch}
          editData={editData}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          searchData={searchData}
          // 전체 목록 리프레시 or 검색 기업 리프레시
          totalItem={totalItem}
        />
      ) : null}
    </div>
  );
}
