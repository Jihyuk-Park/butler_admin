import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import PeriodTableCell from '../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { url } from '../../../../component/commonVariable';
import {
  scrollRightUseEffect,
  periodArrayAuto,
  divideAndComma,
  changeKeyName,
} from '../../../../component/commonFunction';
import EditInputModal from './EditInputModal';

export default function ManagementTable({ searchInput, searchCompanyCode, searchRefreshSwitch }) {
  const periodArray = periodArrayAuto();
  // FinancialData
  const [financialData, setFinancialData] = useState([]);
  // 데이터 수정 후 리프레시
  const [refreshSwitch, setRefreshSwitch] = useState(true);

  // editModal
  const [editModalSwitch, setEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  scrollRightUseEffect(financialData);

  useEffect(() => {
    if (searchCompanyCode !== '') {
      const body = { ...searchInput, corp_code: searchCompanyCode };
      axios
        .get(`${url}/admin/company/financial/management/getData/search/s3`, { params: body })
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
  }, [searchRefreshSwitch, refreshSwitch]);

  const openEditInputModal = period => {
    setEditModalSwitch(true);

    const tempSelectedData = [];

    financialData.map(each => {
      tempSelectedData.push({
        id: each.id,
        type_nm: each.type_nm,
        type: each.type,
        align: each.align,
        fontWeight: each.fontWeight,
        value: each[changeKeyName(period)] || null,
      });
      return null;
    });

    setSelectedData(tempSelectedData);
    setSelectedDate(period);
  };

  return (
    <div>
      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['분기말', 'ID', ...periodArray].map(function (eachdata, index) {
                return (
                  <StyledTableCell
                    key={eachdata}
                    align="center"
                    onClick={
                      searchCompanyCode === '' || index === 0 || index === 1
                        ? null
                        : () => openEditInputModal(eachdata)
                    }
                    sx={[
                      index === 0 || index === 1
                        ? {
                            minWidth: index === 0 ? 180 : 30,
                            position: 'sticky',
                            left: index === 0 ? 0 : 200,
                            zIndex: 100,
                          }
                        : {
                            cursor: 'pointer',
                          },
                    ]}
                  >
                    {eachdata}
                  </StyledTableCell>
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
                    {eachdata.id}
                  </StyledTableCell>
                  {periodArray.map(function (period) {
                    return (
                      <PeriodTableCell align="right" key={`${eachdata.field}${period}`}>
                        {divideAndComma(eachdata[changeKeyName(period)], 1, 0)}
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

      {editModalSwitch === false ? null : (
        <EditInputModal
          editModalSwitch={editModalSwitch}
          setEditModalSwitch={setEditModalSwitch}
          editData={selectedData}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          searchInput={searchInput}
          editDate={selectedDate}
        />
      )}
    </div>
  );
}

ManagementTable.defaultProps = {
  searchInput: {},
  searchCompanyCode: '0',
  searchRefreshSwitch: true,
};

ManagementTable.propTypes = {
  searchInput: PropTypes.objectOf(PropTypes.string),
  searchCompanyCode: PropTypes.string,
  searchRefreshSwitch: PropTypes.bool,
};
