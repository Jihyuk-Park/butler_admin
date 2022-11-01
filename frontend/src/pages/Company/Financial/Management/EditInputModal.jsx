import React, { useState } from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Typography,
  Button,
  Grid,
  Box,
  Modal,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import { url } from '../../../../component/commonVariable';
import { addComma, removeComma } from '../../../../component/commonFunction';

export default function EditInputModal({
  editModalSwitch,
  setEditModalSwitch,
  editData,
  refreshSwitch,
  setRefreshSwitch,
  searchInput,
  editDate,
}) {
  const dataTable = ['ID', '계정이름', '원본 데이터', '수정 값'];
  // input 관리 (deep copy)
  const [editInput, setEditInput] = useState(JSON.parse(JSON.stringify(editData)));

  const onChangeEditInput = (e, index) => {
    const tempInput = [...editInput];
    tempInput[index].value = removeComma(e.target.value);
    setEditInput(tempInput);
  };

  const modalClose = () => setEditModalSwitch(false);

  const saveData = () => {
    const body = [...editInput];
    body.forEach(function (each, index) {
      if (each.value === editData[index].value) {
        body[index].isNeed = 0;
      } else {
        body[index].isNeed = 1;
        if (editData[index].value === null) {
          body[index].type = 'add';
        } else {
          body[index].type = 'update';
        }
      }
      return null;
    });
    // console.log(body);

    if (body.unit === '') {
      alert('단위는 필수 입력사항입니다!');
    } else {
      axios.post(`${url}/admin/company/financial/management/edit`, body).then(() => {
        alert('수정이 완료되었습니다');
        setRefreshSwitch(!refreshSwitch);
        modalClose();
      });
    }
  };

  return (
    <div>
      <Modal open={editModalSwitch} onClose={modalClose}>
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
            p: '35px 50px 50px 50px',
            outline: 'none',
          }}
        >
          <Typography
            component="div"
            align="center"
            color="#333333"
            fontSize="28px"
            fontWeight={600}
            whiteSpace="pre-wrap"
          >
            <Box>
              {searchInput.financialType}({searchInput.fs_div})
            </Box>
            <Box sx={{ fontSize: '24px', mb: '20px' }}>
              20{editDate.substring(1, 3)}년 {editDate.substring(4, 5)}분기
            </Box>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ mb: '30px', maxHeight: { md: '400px', xl: '550px' } }}
          >
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
                    <StyledTableCell align="center" sx={{ minWidth: 30, maxWidth: 30 }}>
                      {eachdata.id}
                    </StyledTableCell>
                    <StyledTableCell
                      align={eachdata.align}
                      sx={{ minWidth: 80, fontWeight: eachdata.fontWeight }}
                    >
                      {eachdata.type_nm}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <TextField
                        disabled
                        variant="standard"
                        value={addComma(editData[index].value) || ''}
                        inputProps={{
                          style: { padding: '3px 5px 3px 10px', margin: 0 },
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
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

          <Grid container justifyContent="center" sx={{ mt: '15px' }}>
            <Button variant="contained" onClick={saveData} sx={{ color: 'white', mr: '10px' }}>
              수정하기
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

EditInputModal.defaultProps = {
  editModalSwitch: true,
  setEditModalSwitch: () => {},
  editData: [],
  editDate: '',
  refreshSwitch: true,
  setRefreshSwitch: () => {},
  searchInput: {},
};

EditInputModal.propTypes = {
  editModalSwitch: PropTypes.bool,
  setEditModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.array,
  editDate: PropTypes.string,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
  searchInput: PropTypes.objectOf(PropTypes.string),
};
