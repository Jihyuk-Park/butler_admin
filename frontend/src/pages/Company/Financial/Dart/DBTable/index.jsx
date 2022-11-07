import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { url } from '../../../../../component/commonVariable';
import { addComma } from '../../../../../component/commonFunction';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';

export default function DBTable({ searchInput, searchCompanyCode, searchRefreshSwitch }) {
  const dataTable = ['DB', '종류', '계정ID', '계정이름', '값', 'ID', '계정이름 '];
  const [dbData, setDbdata] = useState([]);

  useEffect(() => {
    if (searchCompanyCode !== '') {
      const body = { ...searchInput, corp_code: searchCompanyCode };
      axios
        .get(`${url}/admin/company/financial/dart/getData/search/db`, { params: body })
        .then(result => {
          // console.log(result.data);
          setDbdata(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchRefreshSwitch]);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: { md: '545px', xl: '885px' }, my: '20px' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {dataTable.map(function (eachdata) {
              return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {dbData.map(eachdata => (
            <StyledTableRow key={eachdata.id}>
              <StyledTableCell sx={{ minWidth: '60px' }}>{eachdata.type}</StyledTableCell>
              <StyledTableCell sx={{ minWidth: '70px' }}>{eachdata.sj_div}</StyledTableCell>
              <StyledTableCell align="left" sx={{ wordBreak: 'break-all', maxWidth: '15vw' }}>
                {eachdata.account_id}
              </StyledTableCell>
              <StyledTableCell align="left">{eachdata.account_nm}</StyledTableCell>
              <StyledTableCell sx={{ minWidth: '150px' }}>
                {(eachdata.sj_div === 'IS' || eachdata.sj_div === 'CIS') &&
                eachdata.type === 'RAW' &&
                (searchInput.quarter === '2분기' || searchInput.quarter === '3분기')
                  ? addComma(eachdata.thstrm_add_amount)
                  : addComma(eachdata.thstrm_amount)}
              </StyledTableCell>
              <StyledTableCell sx={{ minWidth: '50px' }}>{eachdata.type_id}</StyledTableCell>
              <StyledTableCell sx={{ minWidth: '80px' }}>{eachdata.type_nm}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

DBTable.defaultProps = {
  searchInput: {},
  searchCompanyCode: '0',
  searchRefreshSwitch: true,
};

DBTable.propTypes = {
  searchInput: PropTypes.objectOf(PropTypes.string),
  searchCompanyCode: PropTypes.string,
  searchRefreshSwitch: PropTypes.bool,
};
