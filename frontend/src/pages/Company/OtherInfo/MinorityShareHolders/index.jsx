import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import PeriodTableCell from '../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { url } from '../../../../component/commonVariable';
import {
  scrollRightUseEffect,
  periodArrayAuto,
  addComma,
  changeKeyName,
  divideAndComma,
} from '../../../../component/commonFunction';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';

export default function MinorityShareHolders() {
  const { searchCorpCode } = useParams();

  const minorityShareHoldersArray = [
    '주주 수',
    '전체 주주 수',
    '주주 비율(%)',
    '보유 주식 수(백만주)',
    '총 발행 주식 수(백만주)',
    '보유 주식 비율(%)',
  ];

  // 소액주주 데이터
  const [minorityShareHoldersData, setMinorityShareHoldersData] =
    useState(minorityShareHoldersArray);
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(minorityShareHoldersData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/minorityShareHolders/getData/search/rawReports/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setMinorityShareHoldersData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/OtherInfo/MinorityShareHolders" />

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
            {minorityShareHoldersData.map(function (eachdata, index) {
              return (
                <StyledTableRow key={minorityShareHoldersArray[index]}>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 180,
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#FFFAFA',
                      borderRight: '1px solid black',
                    }}
                  >
                    {minorityShareHoldersArray[index]}
                  </StyledTableCell>
                  {periodArray.map(function (period, periodIndex) {
                    return (
                      <PeriodTableCell
                        align="right"
                        key={`${eachdata}${period}`}
                        sx={[periodIndex % 4 === 3 ? { borderRight: '0.8px solid #A9A9A9' } : {}]}
                      >
                        {index !== 3 && index !== 4
                          ? addComma(eachdata[changeKeyName(period)])
                          : null}
                        {index === 3 || index === 4
                          ? divideAndComma(eachdata[changeKeyName(period)], 1000000, 1)
                          : null}
                      </PeriodTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
            <StyledTableRow />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
