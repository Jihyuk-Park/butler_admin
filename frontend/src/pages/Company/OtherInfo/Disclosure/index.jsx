import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../component/css/DatePicker.css';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Box,
} from '@mui/material';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { url } from '../../../../component/commonVariable';
import { changeDateDot, changeDateNoDot } from '../../../../component/commonFunction';
import Pagination from '../../../../component/Pagination/index';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';

const now = new Date();

export default function Disclosure() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');
  const [clearSwitch, setClearSwitch] = useState(0);

  // 날짜 선택
  const [startDate, setStartDate] = useState(new Date('1998/01/01'));
  const [endDate, setEndDate] = useState(now);
  const dateArray = [
    ['1개월', 'Month', 1],
    ['6개월', 'Month', 6],
    ['1년', 'Year', 1],
    ['3년', 'Year', 3],
    ['5년', 'Year', 5],
    ['10년', 'Year', 10],
  ];

  // 검색 유무 체크 및 훅 리프레시 스위치
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(false);

  // 공시 데이터 관련
  const dataTable = ['보고일', '보고서명', '제출자명', '회사명'];
  const [disclosureData, setDisclosureData] = useState([]);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0);

  // 공시 정보를 받아오는 Hook
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(
          `${url}/admin/company/otherInfo/disclosure/getData/all/${changeDateNoDot(
            startDate,
          )}/${changeDateNoDot(endDate)}/${page}`,
        )
        .then(result => {
          // console.log(result.data);
          setDisclosureData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(
          `${url}/admin/company/otherInfo/disclosure/getData/search/${searchCompanyCode}/${changeDateNoDot(
            startDate,
          )}/${changeDateNoDot(endDate)}/${page}`,
        )
        .then(result => {
          // console.log(result.data);
          setDisclosureData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [page, refreshSwitch]);

  // 전체 페이지 수 계산을 위한 Hook
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(
          `${url}/admin/company/otherInfo/disclosure/getTotalNum/all/${changeDateNoDot(
            startDate,
          )}/${changeDateNoDot(endDate)}/`,
        )
        .then(result => {
          // console.log(result.data.totalnum);
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(
          `${url}/admin/company/otherInfo/disclosure/getTotalNum/search/${searchCompanyCode}/${changeDateNoDot(
            startDate,
          )}/${changeDateNoDot(endDate)}/`,
        )
        .then(result => {
          // console.log(result.data.totalnum);
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [refreshSwitch]);

  const searchData = () => {
    setPage(1);
    setIsSearch(true);
    setRefreshSwitch(!refreshSwitch);
  };

  const resetSearch = () => {
    setPage(1);
    setIsSearch(false);
    setSearchCompanyCode('');
    setRefreshSwitch(!refreshSwitch);
    setClearSwitch(clearSwitch + 1);
  };

  const searchDate = () => {
    setPage(1);
    setRefreshSwitch(!refreshSwitch);
  };

  const resetDate = () => {
    setStartDate(new Date('1998/01/01'));
    setEndDate(now);
    setPage(1);
    setRefreshSwitch(!refreshSwitch);
  };

  const recentDate = (period, num) => {
    setEndDate(now);
    if (period === 'Month') {
      setStartDate(new Date(new Date().setMonth(now.getMonth() - num)));
    } else {
      setStartDate(new Date(new Date().setFullYear(now.getFullYear() - num)));
    }
  };

  const goToReport = no => {
    window.open(`http://dart.fss.or.kr/dsaf001/main.do?rcpNo=${no}`);
  };

  return (
    <div>
      <Stack direction="row" spacing={6} alignItems="flex-start" sx={{ mb: '10px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete
            onChangeCompanyCode={setSearchCompanyCode}
            clearSwitch={clearSwitch}
            minWidth="300px"
          />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
          <Button variant="contained" color="inactive" onClick={resetSearch} sx={{ color: '#FFF' }}>
            초기화
          </Button>
        </Stack>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: '10px' }}>
            <Box>
              <DatePicker
                className="DatePicker"
                selected={startDate}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                minDate={new Date('1998/01/01')}
                maxDate={now}
                endDate={endDate}
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
              />
            </Box>

            <Box>
              <DatePicker
                className="DatePicker"
                selected={endDate}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={new Date('1998/01/01')}
                maxDate={now}
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
              />
            </Box>
            <Button variant="contained" color="secondary" onClick={searchDate}>
              검색
            </Button>
            <Button variant="contained" color="inactive" onClick={resetDate} sx={{ color: '#FFF' }}>
              초기화
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: '20px' }}>
            {dateArray.map(function (each) {
              return (
                <Button
                  key={each[0]}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    recentDate(each[1], each[2]);
                  }}
                >
                  {each[0]}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Stack>

      {/* 공시 데이터 영역 */}
      <TableContainer component={Paper} sx={{ maxHeight: { md: '485px', xl: '825px' } }}>
        <Table stickyHeader>
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
            {disclosureData.map(eachdata => (
              <StyledTableRow key={eachdata.rcept_no}>
                <StyledTableCell align="center" sx={{ minWidth: 90, maxWidth: 90 }}>
                  {changeDateDot(eachdata.rcept_dt)}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  onClick={() => {
                    goToReport(eachdata.rcept_no);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <u>{eachdata.report_nm}</u>
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ minWidth: 100, maxWidth: 100, wordBreak: 'break-all' }}
                >
                  {eachdata.flr_nm}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ minWidth: 100, maxWidth: 100, wordBreak: 'break-all' }}
                >
                  {eachdata.corp_name}
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
