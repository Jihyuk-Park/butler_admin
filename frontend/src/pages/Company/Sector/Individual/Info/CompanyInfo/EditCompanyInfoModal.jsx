import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import DropDown from '../../../../../../component/UI/DropDown';

export default function EditCompanyInfoModal({
  editModalSwitch,
  setEditModalSwitch,
  editData,
  refreshSwitch,
  setRefreshSwitch,
}) {
  const editField = ['정보1', '정보2', '소스', '통화', '단위', '서비스 여부'];
  // input 관리
  const [editInput, setEditInput] = useState(editData);
  const editInputKey = [
    'segment_title1',
    'segment_title2',
    'segment_source',
    'currency',
    'unit',
    'is_available',
  ];
  const currencyList = ['KRW', 'USD', 'JPY', 'HDK', 'CNY'];
  const availableList = ['O', 'X'];

  const modalClose = () => setEditModalSwitch(false);

  const saveData = () => {
    const body = { ...editInput };
    if (body.unit === '') {
      alert('단위는 필수 입력사항입니다!');
    } else {
      axios.post(`/admin/company/sector/individual/info/company/edit`, body).then(() => {
        alert('수정이 완료되었습니다');
        setRefreshSwitch(!refreshSwitch);
        modalClose();
      });
    }
  };

  const onChangeEditInput = e => {
    const { name, value } = e.target;
    // console.log(name, value);
    setEditInput({
      ...editInput,
      [name]: value,
    });
  };

  return (
    <div>
      <Modal open={editModalSwitch} onClose={modalClose}>
        <Box
          sx={{
            width: 500,
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
            <Box sx={{ mb: '20px' }}>{editData.corp_name}</Box>
          </Typography>
          {editField.map(function (each, index) {
            return (
              <Stack key={each} direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: '90px' }}>
                  <h4>{each}</h4>
                </Box>
                {index === 3 || index === 5 ? (
                  <DropDown
                    label={each}
                    selectList={index === 3 ? currencyList : availableList}
                    name={editInputKey[index]}
                    onChange={onChangeEditInput}
                    value={editInput[editInputKey[index]]}
                  />
                ) : (
                  <Box sx={{ width: '300px' }}>
                    <TextField
                      fullWidth
                      name={editInputKey[index]}
                      onChange={onChangeEditInput}
                      value={editInput[editInputKey[index]] || ''}
                    />
                  </Box>
                )}
              </Stack>
            );
          })}

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

EditCompanyInfoModal.defaultProps = {
  editModalSwitch: true,
  setEditModalSwitch: () => {},
  editData: {},
  refreshSwitch: true,
  setRefreshSwitch: () => {},
};

EditCompanyInfoModal.propTypes = {
  editModalSwitch: PropTypes.bool,
  setEditModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.object,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
};
