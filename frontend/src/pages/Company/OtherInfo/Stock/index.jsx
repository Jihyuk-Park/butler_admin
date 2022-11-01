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
  changeDateDash,
  divideAndComma,
} from '../../../../component/commonFunction';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';

export default function Stock() {
  const { searchCorpCode } = useParams();

  // StockData
  const stockAccountArray = ['최종거래일', '수정주가', '발행주식수(천주)', '보통주 시가총액'];
  const [stockData, setStockData] = useState(stockAccountArray);
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(stockData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/otherInfo/stock/getData/search/rawReports/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          setStockData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/OtherInfo/Stock" />

      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['(십억)', ...periodArray].map(function (eachdata, index) {
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
            {stockData.map(function (eachdata, index) {
              return (
                <StyledTableRow key={stockAccountArray[index]}>
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
                    {stockAccountArray[index]}
                  </StyledTableCell>
                  {periodArray.map(function (period) {
                    return (
                      <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                        {index === 0 ? changeDateDash(eachdata[changeKeyName(period)]) : null}
                        {index === 2
                          ? divideAndComma(eachdata[changeKeyName(period)], 1000, 0)
                          : null}
                        {index === 1 || index === 3
                          ? addComma(eachdata[changeKeyName(period)])
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
