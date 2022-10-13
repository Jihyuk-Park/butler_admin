import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export default function EditModal({
  editModalSwitch,
  setEditModalSwitch,
  editData,
  refreshSwitch,
  setRefreshSwitch,
  searchData,
  totalItem,
}) {
  // edit 인풋
  const editField = ['IR주소', '키워드'];
  const [editIR, setEditIR] = useState(editData.ir_url);
  const [editKeyword, setEditKeyword] = useState(editData.keyword);
  const editArray = [editIR, editKeyword];

  // 수정하기 활성화 state
  const [editButtonSwitch, setEditButtonSwitch] = useState(false);

  const onChangeEditIr = e => {
    setEditIR(e.target.value);
    if (e.target.value === editData.ir_url && editData.keyword === editKeyword) {
      setEditButtonSwitch(false);
    } else {
      setEditButtonSwitch(true);
    }
  };
  const onChangeEditKeyword = e => {
    setEditKeyword(e.target.value);
    if (editData.ir_url === editIR && e.target.value === editData.keyword) {
      setEditButtonSwitch(false);
    } else {
      setEditButtonSwitch(true);
    }
  };

  const modalClose = () => setEditModalSwitch(false);

  const saveData = () => {
    const body = {
      corp_code: editData.corp_code,
      keyword: editKeyword,
      ir_url: editIR,
    };

    axios.post(`/admin/company/companyList/edit`, body).then(() => {
      if (totalItem === 1) {
        searchData();
      } else {
        setRefreshSwitch(!refreshSwitch);
      }
      alert('수정이 완료되었습니다');
      modalClose();
    });
  };

  return (
    <div>
      <Modal open={editModalSwitch} onClose={modalClose}>
        <Box
          sx={{
            width: 600,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#F8F8F8',
            border: '1px solid #B8B8B8;',
            borderRadius: '4px',
            p: '30px 40px 45px 40px',
            outline: 'none',
          }}
        >
          <Typography
            component="div"
            align="center"
            color="#333333"
            fontSize="20px"
            fontWeight={600}
          >
            <Box sx={{ mb: '20px' }}>{editData.corp_name}</Box>
          </Typography>

          {editField.map(function (each, index) {
            return (
              <Stack key={each} direction="row" spacing={3} alignItems="center" sx={{ mb: '10px' }}>
                <Box sx={{ width: '70px' }}>
                  <h4>{each}</h4>
                </Box>
                <TextField
                  fullWidth
                  value={editArray[index]}
                  onChange={index === 0 ? onChangeEditIr : onChangeEditKeyword}
                />
              </Stack>
            );
          })}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              disabled={editButtonSwitch === false}
              variant="contained"
              onClick={saveData}
              sx={{ color: 'white', mr: '30px', width: '100px' }}
            >
              수정하기
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={modalClose}
              sx={{ width: '100px' }}
            >
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

EditModal.defaultProps = {
  editData: {},
  editModalSwitch: true,
  setEditModalSwitch: () => {},
  refreshSwitch: true,
  setRefreshSwitch: () => {},
  searchData: () => {},
  totalItem: 10,
};

EditModal.propTypes = {
  editData: PropTypes.objectOf(PropTypes.string),
  editModalSwitch: PropTypes.bool,
  setEditModalSwitch: PropTypes.func,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
  searchData: PropTypes.func,
  totalItem: PropTypes.number,
};
