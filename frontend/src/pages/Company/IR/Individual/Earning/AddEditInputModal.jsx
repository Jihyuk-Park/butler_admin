import React, { useState, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import DropDown from '../../../../../component/UI/DropDown';
import { YearArrayAuto } from '../../../../../component/commonFunction';

export default function AddEditInputModal({
  addEditModalSwitch,
  setAddEditModalSwitch,
  editData,
  refreshSwtich,
  setRefreshSwtich,
  isEditModal,
  earningData,
}) {
  const editField = ['파일명', '사업연도', '분기'];
  // 연도 및 분기
  const yearArray = YearArrayAuto();
  const quarterArray = ['1', '2', '3', '4'];
  const [editYear, setEditYear] = useState(
    isEditModal === true ? editData.bsns_year.toString() : '',
  );
  const [editQuarter, setEditQuarter] = useState(
    isEditModal === true ? editData.quarter_id.toString() : '',
  );

  // 드롭다운 onChange
  const onChangeYear = e => setEditYear(e.target.value);
  const onChangeQuarter = e => setEditQuarter(e.target.value);
  const editArray = [
    [yearArray, editYear, onChangeYear],
    [quarterArray, editQuarter, onChangeQuarter],
  ];
  // 파일 추가 시
  const [newFile, setNewFile] = useState({ name: '' });
  const fileInput = useRef();

  const modalClose = () => setAddEditModalSwitch(false);

  const saveData = () => {
    const body = {
      id: editData.id,
      bsns_year: editYear,
      quarter_id: editQuarter,
    };
    // console.log(body);
    if (isEditModal) {
      axios.post(`/admin/company/ir/individual/edit/earning`, body).then(() => {
        alert('수정이 완료되었습니다');
        setRefreshSwtich(!refreshSwtich);
        modalClose();
      });
    } else {
      // eslint-disable-next-line
      if (editYear === '' || editQuarter === '' || newFile.name === '') {
        alert('데이터 혹은 파일을 추가해주세요');
      } else {
        const formData = new FormData();
        formData.append('file', newFile);
        formData.append('bsns_year', editYear);
        formData.append('quarter_id', editQuarter);

        // 입력한 연도, 분기에 데이터가 있는지 체크
        const checkDuplicatePeriod = earningData.filter(
          data =>
            data.bsns_year === parseInt(editYear, 10) &&
            data.quarter_id === parseInt(editQuarter, 10),
        );
        if (checkDuplicatePeriod.length === 0) {
          formData.append('isDuplicate', 0);
        } else {
          formData.append('isDuplicate', 1);
        }

        axios.post(`/admin/company/ir/individual/add/earning`, formData).then(() => {
          alert('추가가 완료되었습니다');
          setRefreshSwtich(!refreshSwtich);
          modalClose();
        });
      }
    }
  };

  const addFile = () => {
    fileInput.current.click();
  };

  const onChangeFile = e => {
    if (e.target.files[0]) {
      // 같은 이름의 파일이 있는지 체크
      const checkDuplicateFile = earningData.filter(
        data => data.file_name === e.target.files[0].name,
      );
      // console.log(checkDuplicate);
      if (checkDuplicateFile.length === 0) {
        setNewFile(e.target.files[0]);
      } else {
        alert('동일한 파일명이 존재합니다');
      }
    }
  };

  return (
    <div>
      <Modal open={addEditModalSwitch} onClose={modalClose}>
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
            p: '35px 20px 50px 20px',
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
                <Box sx={{ width: '70px' }}>
                  <h4>{each}</h4>
                </Box>
                {index === 0 ? (
                  <Box>
                    {isEditModal === true ? editData.file_name : ''} {newFile && newFile.name}
                  </Box>
                ) : (
                  <DropDown
                    label={each}
                    value={editArray[index - 1][1]}
                    selectList={editArray[index - 1][0]}
                    onChange={editArray[index - 1][2]}
                  />
                )}
              </Stack>
            );
          })}

          {isEditModal === true ? null : (
            <Grid container justifyContent="center" sx={{ mt: '10px' }}>
              <Button variant="contained" color="secondary" onClick={addFile}>
                파일 추가
                <input
                  type="file"
                  hidden
                  onChange={onChangeFile}
                  ref={fileInput}
                  accept="application/pdf"
                />
              </Button>
            </Grid>
          )}
          <Grid container justifyContent="center" sx={{ mt: '15px' }}>
            <Button variant="contained" onClick={saveData} sx={{ color: 'white', mr: '10px' }}>
              {isEditModal === true ? '수정하기' : '추가하기'}
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

AddEditInputModal.defaultProps = {
  isEditModal: true,
  addEditModalSwitch: true,
  setAddEditModalSwitch: () => {},
  editData: {},
  refreshSwtich: true,
  setRefreshSwtich: () => {},
  earningData: [],
};

AddEditInputModal.propTypes = {
  isEditModal: PropTypes.bool,
  addEditModalSwitch: PropTypes.bool,
  setAddEditModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.object,
  refreshSwtich: PropTypes.bool,
  setRefreshSwtich: PropTypes.func,
  // eslint-disable-next-line
  earningData: PropTypes.array,
};
