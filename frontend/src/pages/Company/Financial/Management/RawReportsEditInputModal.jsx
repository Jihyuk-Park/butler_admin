import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import { addComma, removeComma } from '../../../../component/commonFunction';
import { url } from '../../../../component/commonVariable';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../component/UI/StyledTableRow';
import CustomModal from '../../../../component/UI/CustomModal';

export default function EditInputModal({
  editInputModalSwitch,
  setEditInputModalSwitch,
  editData,
  editDate,
  searchInput,
  searchCompanyCode,
  searchRefreshSwitch,
  setSearchRefreshSwitch,
}) {
  // 재무제표 타입 및 기간 텍스트
  const [typeText, dateText] = [
    `${searchInput.financialType}(${searchInput.fs_div})`,
    `20${editDate.substring(1, 3)}년 ${editDate.substring(4, 5)}분기`,
  ];
  const dataTable = ['ID', '계정이름', '원본 데이터', '수정 값'];
  // input 관리 (deep copy)
  const [editInput, setEditInput] = useState(JSON.parse(JSON.stringify(editData)));
  // 수정 창 & 수정할 데이터
  const [editConfirmModal, setEditConfirmModal] = useState(false);
  const [changedData, setChangedData] = useState([]);

  const onChangeEditInput = (e, index) => {
    const tempInput = [...editInput];
    tempInput[index].value = removeComma(e.target.value);
    setEditInput(tempInput);
  };

  const confirmSave = () => {
    const checkChangedData = [];
    // 변경 값이 있는 데이터만 전달
    editInput.forEach(function (each, index) {
      if (each.value !== editData[index].value) {
        checkChangedData.push(each);
      }
      return null;
    });

    if (checkChangedData.length === 0) {
      alert('수정된 데이터가 없습니다');
    } else {
      setEditConfirmModal(true);
      setChangedData(checkChangedData);
    }
  };

  const saveData = () => {
    const conditionArray = {
      ...searchInput,
      searchCompanyCode,
      bsns_year: `20${editDate.substring(1, 3)}`,
      quarter_id: editDate.substring(4, 5),
    };
    const body = [conditionArray, ...changedData];
    // console.log(body);
    axios
      .post(`${url}/admin/company/financial/management/edit`, body)
      .then(() => {
        // axios.get(`${url}/admin/genearteReprot`).then(() => {

        // })
        alert('수정이 완료되었습니다');
        modalClose();
        setSearchRefreshSwitch(!searchRefreshSwitch);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  const modalClose = () => {
    setEditInputModalSwitch(false);
  };

  return (
    <div>
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
            <Box sx={{ fontSize: '32px' }}>{typeText}</Box>
            <Box sx={{ mb: '15px' }}>{dateText}</Box>
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
              onClick={confirmSave}
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
      {editConfirmModal === true ? (
        <CustomModal
          customModalSwitch={editConfirmModal}
          setCustomModalSwitch={setEditConfirmModal}
          message={`${dateText} ${typeText}를\n 수정하시겠습니까?`}
          customFunction={saveData}
        />
      ) : null}
    </div>
  );
}

EditInputModal.defaultProps = {
  editInputModalSwitch: false,
  setEditInputModalSwitch: () => {},
  editData: [],
  editDate: '',
  searchInput: {},
  searchCompanyCode: '',
  searchRefreshSwitch: true,
  setSearchRefreshSwitch: () => {},
};

EditInputModal.propTypes = {
  editInputModalSwitch: PropTypes.bool,
  setEditInputModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.array,
  editDate: PropTypes.string,
  searchInput: PropTypes.objectOf(PropTypes.string),
  searchCompanyCode: PropTypes.string,
  searchRefreshSwitch: PropTypes.bool,
  setSearchRefreshSwitch: PropTypes.func,
};
