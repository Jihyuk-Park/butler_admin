import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Button,
  Box,
  Grid,
  Typography,
  TextField,
} from '@mui/material';
import { addComma, removeComma } from '../../../../../component/commonFunction';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';

export default function EditInputModal({
  editInputModalSwitch,
  setEditInputModalSwitch,
  editData,
  searchInput,
}) {
  const dataTable = ['ID', '계정이름', '원본 데이터', '수정 값'];
  // input 관리 (deep copy)
  const [editInput, setEditInput] = useState(JSON.parse(JSON.stringify(editData)));

  const onChangeEditInput = (e, index) => {
    const tempInput = [...editInput];
    tempInput[index].value = removeComma(e.target.value);
    setEditInput(tempInput);
  };

  const saveData = () => {
    const body = [...editInput];
    const changedData = [];

    body.forEach(function (each, index) {
      if (each.value !== editData[index].value) {
        changedData.push(each);
      }
      return null;
    });

    if (changedData.length === 0) {
      alert('수정된 데이터가 없습니다');
    } else {
      console.log(changedData);
    }
  };

  const modalClose = () => {
    setEditInputModalSwitch(false);
  };

  return (
    <Modal open={editInputModalSwitch} onClose={modalClose}>
      <Box
        sx={{
          width: 800,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#F8F8F8',
          border: '1px solid #B8B8B8;',
          borderRadius: '4px',
          p: '30px 20px 35px 20px',
          outline: 'none',
        }}
      >
        <Typography component="div" align="center" variant="h5">
          <Box sx={{ fontSize: '32px' }}>
            {searchInput.financialType}({searchInput.fs_div})
          </Box>
          <Box sx={{ mb: '15px' }}>
            {searchInput.year} {searchInput.quarter}
          </Box>
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: { md: '445px', xl: '655px' } }}>
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
              {editData.map((eachdata, index) => (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell align="center" sx={{ minWidth: '30px' }}>
                    {eachdata.id}
                  </StyledTableCell>
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
                  <StyledTableCell
                    align="right"
                    sx={{ minWidth: '100px', fontWeight: eachdata.fontWeight }}
                  >
                    <TextField
                      value={addComma(editInput[index].value) || ''}
                      name={`${index}`}
                      onChange={e => {
                        onChangeEditInput(e, index);
                      }}
                      inputProps={{
                        style: { padding: '3px 5px 3px 10px', margin: 0 },
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="center" sx={{ mt: '25px' }}>
          <Button
            variant="contained"
            onClick={saveData}
            sx={{ mx: '10px', color: '#FFF', width: '100px' }}
          >
            저장
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={modalClose}
            sx={{ mx: '10px', width: '100px' }}
          >
            취소
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
}

EditInputModal.defaultProps = {
  editData: [],
  editInputModalSwitch: false,
  setEditInputModalSwitch: () => {},
  searchInput: {},
};

EditInputModal.propTypes = {
  // eslint-disable-next-line
  editData: PropTypes.array,
  editInputModalSwitch: PropTypes.bool,
  setEditInputModalSwitch: PropTypes.func,
  searchInput: PropTypes.objectOf(PropTypes.string),
};
