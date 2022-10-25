import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import StyledTableCell from '../../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../../component/commonVariable';
import { addComma, removeComma } from '../../../../../../component/commonFunction';

export default function EditAddSalesAndProfitModal({
  type,
  editModalSwitch,
  setEditModalSwitch,
  editData,
  editDate,
  refreshSwitch,
  setRefreshSwitch,
  unit,
}) {
  const { searchCorpCode } = useParams();
  const dataTable = ['부문1', '부문2', '부문3', '원본 데이터', editDate];
  // input 관리 (객체 배열이기에[...editData]는 얕은 복사)
  const [editInput, setEditInput] = useState(JSON.parse(JSON.stringify(editData)));

  const onChangeEditInput = (e, index) => {
    const tempInput = [...editInput];
    tempInput[index].value = removeComma(e.target.value);
    setEditInput(tempInput);
  };

  const modalClose = () => setEditModalSwitch(false);

  console.log(editData);

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

    const year = `20${editDate.substring(1, 3)}`;
    const quarter = editDate.substring(4, 5);
    if (body.unit === '') {
      alert('단위는 필수 입력사항입니다!');
    } else {
      axios
        .post(
          `${url}/admin/company/sector/individual/performance/${type}/edit/${searchCorpCode}/${year}/${quarter}/${unit}`,
          body,
        )
        .then(() => {
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
            fontSize="20px"
            fontWeight={600}
            whiteSpace="pre-wrap"
          >
            <Box sx={{ mb: '20px' }}>부문실적 입력</Box>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ mb: '30px', maxHeight: { md: '400px', xl: '500px' } }}
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
                    <StyledTableCell align="center" sx={{ minWidth: 40, maxWidth: 40 }}>
                      {eachdata.depth1}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ minWidth: 40, maxWidth: 40 }}>
                      {eachdata.depth2}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ minWidth: 40, maxWidth: 40 }}>
                      {eachdata.depth3}
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

EditAddSalesAndProfitModal.defaultProps = {
  type: 'sales',
  editModalSwitch: true,
  setEditModalSwitch: () => {},
  editData: [],
  editDate: '',
  refreshSwitch: true,
  setRefreshSwitch: () => {},
  unit: 1,
};

EditAddSalesAndProfitModal.propTypes = {
  type: PropTypes.string,
  editModalSwitch: PropTypes.bool,
  setEditModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.array,
  editDate: PropTypes.string,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
  unit: PropTypes.number,
};
