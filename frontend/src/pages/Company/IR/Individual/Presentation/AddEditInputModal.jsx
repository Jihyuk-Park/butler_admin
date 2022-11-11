import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { changeDateNoDot } from '../../../../../component/commonFunction';

export default function AddEditInputModal({
  addEditModalSwitch,
  setAddEditModalSwitch,
  editData,
  refreshSwitch,
  setRefreshSwitch,
  isEditModal,
  presentationData,
}) {
  const { searchStockCode } = useParams();
  // 필드
  const editField = ['파일명', '날짜\n(20220101)', '행사명', '제목'];
  // 날짜, 행사명, 제목 인풋
  const [editDate, setEditDate] = useState(
    isEditModal === true ? changeDateNoDot(editData.published_date) : '',
  );
  const [editConferenceName, setEditConferenceName] = useState(
    isEditModal === true ? editData.conference_name : '',
  );
  const [editTitle, setEditTitle] = useState(isEditModal === true ? editData.title : '');

  // 드롭다운 onChange
  const onChangeDate = e => setEditDate(e.target.value);
  const onChangeConferenceName = e => setEditConferenceName(e.target.value);
  const onChangeTitle = e => setEditTitle(e.target.value);
  const editArray = [
    [editDate, onChangeDate],
    [editConferenceName, onChangeConferenceName],
    [editTitle, onChangeTitle],
  ];

  // 파일 추가 시
  const [newFile, setNewFile] = useState({ name: '' });
  const fileInput = useRef();

  const modalClose = () => setAddEditModalSwitch(false);

  const saveData = () => {
    const body = {
      id: editData.id,
      corp_code: editData.corp_code,
      published_date: editDate,
      conference_name: editConferenceName,
      title: editTitle,
    };
    // console.log(body);
    if (isEditModal) {
      const isPeridDuplicate = checkDuplicatePeriod();
      if (isPeridDuplicate !== 0) {
        alert('중복된 기간과 행사명이 있습니다');
      } else {
        axios.post(`/admin/company/ir/individual/edit/presentation`, body).then(() => {
          alert('수정이 완료되었습니다');
          setRefreshSwitch(!refreshSwitch);
          modalClose();
        });
      }
    } else {
      // eslint-disable-next-line
      if (editDate === '' || editConferenceName === '' || editTitle === '' || newFile.name === '') {
        alert('데이터 혹은 파일을 추가해주세요');
      } else {
        const formData = new FormData();
        formData.append('published_date', editDate);
        formData.append('conference_name', editConferenceName);
        formData.append('title', editTitle);
        formData.append('stock_code', searchStockCode);
        formData.append('directory', '3. IR Presentation');

        // 입력한 날짜, 행사명의 데이터가 있는지 체크
        const isPeridDuplicate = checkDuplicatePeriod();
        if (isPeridDuplicate === 0) {
          formData.append('isDuplicate', 0);
        } else {
          formData.append('isDuplicate', isPeridDuplicate[0].id);
          formData.append('deleteFileName', isPeridDuplicate[0].file_name);
        }
        formData.append('file', newFile);

        axios.post(`/admin/company/ir/individual/add/presentation`, formData).then(() => {
          alert('추가가 완료되었습니다');
          setRefreshSwitch(!refreshSwitch);
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
      const checkDuplicateFile = presentationData.filter(
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

  const checkDuplicatePeriod = () => {
    let isPeriodDuplicate;
    const checkDuplicateArray = presentationData.filter(
      data =>
        changeDateNoDot(data.published_date) === editDate &&
        data.conference_name === editConferenceName,
    );

    if (checkDuplicateArray.length === 0) {
      isPeriodDuplicate = 0;
    } else {
      isPeriodDuplicate = checkDuplicateArray;
    }
    return isPeriodDuplicate;
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
                <Box sx={{ width: '130px' }}>
                  <h4>{each}</h4>
                </Box>
                {index === 0 ? (
                  <Box>
                    {isEditModal === true ? editData.file_name : ''} {newFile && newFile.name}
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    value={editArray[index - 1][0]}
                    onChange={editArray[index - 1][1]}
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
  refreshSwitch: true,
  setRefreshSwitch: () => {},
  presentationData: [],
};

AddEditInputModal.propTypes = {
  isEditModal: PropTypes.bool,
  addEditModalSwitch: PropTypes.bool,
  setAddEditModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.object,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
  // eslint-disable-next-line
  presentationData: PropTypes.array,
};
