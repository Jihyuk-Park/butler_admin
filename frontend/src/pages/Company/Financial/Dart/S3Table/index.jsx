import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { url } from '../../../../../component/commonVariable';
import { addComma } from '../../../../../component/commonFunction';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import EditInputModal from './EditInputModal';

export default function S3Table({
  searchInput,
  searchCompanyCode,
  searchRefreshSwitch,
  setSearchRefreshSwitch,
}) {
  const dataTable = ['ID', '계정이름', '값'];
  const [s3Data, setS3data] = useState([]);

  const [editInputModalSwitch, setEditInputModalSwitch] = useState(false);

  useEffect(() => {
    if (searchCompanyCode !== '') {
      const body = { ...searchInput, corp_code: searchCompanyCode };
      axios
        .get(`${url}/admin/company/financial/dart/getData/search/s3`, { params: body })
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            setS3data([]);
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setS3data(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchRefreshSwitch]);

  const openEditInputModal = () => {
    setEditInputModalSwitch(true);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        disabled={searchCompanyCode === ''}
        fullWidth
        onClick={openEditInputModal}
        sx={{ mt: '-40px' }}
      >
        수정하기
      </Button>
      <TableContainer component={Paper} sx={{ maxHeight: { md: '545px', xl: '885px' } }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {dataTable.map(function (eachdata) {
                return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {s3Data.map(eachdata => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell sx={{ minWidth: '50px' }}>{eachdata.id}</StyledTableCell>
                <StyledTableCell
                  align={eachdata.align}
                  sx={{ minWidth: '70px', fontWeight: eachdata.fontWeight }}
                >
                  {eachdata.type_nm}
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  sx={{ minWidth: '100px', fontWeight: eachdata.fontWeight }}
                >
                  {addComma(eachdata.value)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editInputModalSwitch === false ? null : (
        <EditInputModal
          editData={s3Data}
          editInputModalSwitch={editInputModalSwitch}
          setEditInputModalSwitch={setEditInputModalSwitch}
          searchInput={searchInput}
          searchCompanyCode={searchCompanyCode}
          searchRefreshSwitch={searchRefreshSwitch}
          setSearchRefreshSwitch={setSearchRefreshSwitch}
        />
      )}
    </div>
  );
}

S3Table.defaultProps = {
  searchInput: {},
  searchCompanyCode: '0',
  searchRefreshSwitch: true,
  setSearchRefreshSwitch: () => {},
};

S3Table.propTypes = {
  searchInput: PropTypes.objectOf(PropTypes.string),
  searchCompanyCode: PropTypes.string,
  searchRefreshSwitch: PropTypes.bool,
  setSearchRefreshSwitch: PropTypes.func,
};
