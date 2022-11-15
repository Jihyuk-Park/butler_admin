import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import PeriodTableCell2 from '../../../../component/UI/PeriodTableCell2';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { url } from '../../../../component/commonVariable';
import {
  scrollRightUseEffect,
  periodArrayAuto,
  divideAndComma,
  changeKeyName,
} from '../../../../component/commonFunction';

export default function QuarterReportsManagement({
  searchInput,
  searchCompanyCode,
  searchRefreshSwitch,
}) {
  const periodArray = periodArrayAuto();
  // FinancialData
  const [financialData, setFinancialData] = useState([]);

  scrollRightUseEffect(financialData, 2);

  useEffect(() => {
    if (searchCompanyCode !== '') {
      const body = { ...searchInput, corp_code: searchCompanyCode };
      axios
        .get(`${url}/admin/company/financial/management/getData/search/quarterReports/s3`, {
          params: body,
        })
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setFinancialData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchRefreshSwitch]);

  return (
    <div>
      <TableContainer
        id="table2"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['분기별 (십억)', 'ID', ...periodArray].map(function (eachdata, index) {
                return (
                  <PeriodTableCell2
                    key={eachdata}
                    align="center"
                    sx={[
                      index === 0 || index === 1
                        ? {
                            minWidth: index === 0 ? 180 : 30,
                            position: 'sticky',
                            left: index === 0 ? 0 : 200,
                            zIndex: 100,
                          }
                        : null,
                    ]}
                  >
                    {eachdata}
                  </PeriodTableCell2>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {financialData.map(function (eachdata) {
              return (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell
                    align={eachdata.align}
                    sx={{
                      minWidth: 180,
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#FFFAFA',
                      borderRight: '1px solid black',
                      fontWeight: eachdata.fontWeight,
                    }}
                  >
                    {eachdata.type_nm}
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 30,
                      maxWidth: 30,
                      position: 'sticky',
                      left: 201,
                      backgroundColor: '#FFFAFA',
                      borderRight: '1px solid black',
                    }}
                  >
                    {null}
                  </StyledTableCell>
                  {periodArray.map(function (period) {
                    return (
                      <PeriodTableCell2 align="right" key={`${eachdata.field}${period}`}>
                        {divideAndComma(eachdata[changeKeyName(period)], 1000000000, 1)}
                      </PeriodTableCell2>
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

QuarterReportsManagement.defaultProps = {
  searchInput: {},
  searchCompanyCode: '0',
  searchRefreshSwitch: true,
};

QuarterReportsManagement.propTypes = {
  searchInput: PropTypes.objectOf(PropTypes.string),
  searchCompanyCode: PropTypes.string,
  searchRefreshSwitch: PropTypes.bool,
};
