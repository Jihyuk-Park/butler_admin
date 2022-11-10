import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import { addComma } from '../../../component/commonFunction';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import { url } from '../../../component/commonVariable';

export default function UserEntire() {
  // 데이터 정렬 기준 선택
  const [sortField, setSortField] = useState('일자');
  const [sortType, setSortType] = useState('▼');

  // 데이터 종류
  const dataTypeList = ['일간', '월간'];
  const [dataType, setDataType] = useState('일간');

  // 전체 유저 정보 데이터 관련
  const dataTable = [
    '일자',
    `네이버 ${dataType} 가입자`,
    `카카오 ${dataType} 가입자`,
    `${dataType} 가입자 합계`,
    '네이버 누적 가입자',
    '카카오 누적 가입자',
    '누적 가입자 통계',
  ];
  const [entireUserData, setEntireData] = useState([]);

  // 정렬 기준에 따라 전체 유저 정보를 받아오는 Hook
  useEffect(() => {
    axios
      .get(`${url}/admin/user/userEntire/getData/${dataType}/${sortField}/${sortType}`)
      .then(result => {
        // console.log(result.data);
        setEntireData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [dataType, sortField, sortType]);

  // 데이터 정렬 기준 선택
  const selectSortType = type => {
    setEntireData([]);
    setDataType(type);
  };

  // 정렬
  const sortData = field => {
    if (field !== '삭제') {
      if (sortField !== field) {
        setSortField(field);
      } else if (sortField === field) {
        if (sortType === '▼') {
          setSortType('▲');
        } else {
          setSortField('일자');
          setSortType('▼');
        }
      }
    }
  };

  return (
    <div>
      {/* 정렬 영역  */}
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        {dataTypeList.map(function (each) {
          return (
            <Button
              key={each}
              variant={dataType === each ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => {
                selectSortType(each);
              }}
              sx={{ mr: '8px' }}
            >
              {each}
            </Button>
          );
        })}
      </Grid>

      {/* 전체 유저 정보 영역 */}
      <TableContainer component={Paper} sx={{ maxHeight: { md: '630px', xl: '990px' } }}>
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
            {entireUserData.map(function (eachdata) {
              return (
                <StyledTableRow key={eachdata.date}>
                  <StyledTableCell>{changeDate(eachdata.date, dataType)}</StyledTableCell>
                  <StyledTableCell align="right">{addComma(eachdata.NAVER)}</StyledTableCell>
                  <StyledTableCell align="right">{addComma(eachdata.KAKAO)}</StyledTableCell>
                  <StyledTableCell align="right">{addComma(eachdata.Daily)}</StyledTableCell>
                  <StyledTableCell align="right">{addComma(eachdata.TOTAL_NAVER)}</StyledTableCell>
                  <StyledTableCell align="right">{addComma(eachdata.TOTAL_KAKAO)}</StyledTableCell>
                  <StyledTableCell align="right">{addComma(eachdata.TOTAL_Daily)}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function changeDate(date, sortType) {
  let publishDate;
  if (sortType === '일간') {
    publishDate = moment(date).format('YYYY.MM.DD (dd)');
  } else {
    publishDate = moment(date).format('YYYY.MM');
  }
  return publishDate;
}
