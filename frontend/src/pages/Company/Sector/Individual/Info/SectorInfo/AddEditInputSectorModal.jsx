import React, { useState } from 'react';
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
import { url } from '../../../../../../component/commonVariable';
import DropDown from '../../../../../../component/UI/DropDown';

export default function AddEditInputSectorModal({
  addEditModalSwitch,
  setAddEditModalSwitch,
  editData,
  sectorInfoData,
  refreshSwitch,
  setRefreshSwitch,
  isEditModal,
  companyInfoData,
}) {
  const { searchCorpCode } = useParams();
  const editField = ['부문1', '부문2', '부문3', '주요부문 여부', '부문 설명'];
  const defaultInput = {
    depth1: '',
    depth2: '',
    depth3: '',
    is_importance: 'O',
    description: '',
  };
  // input 관리
  const [editInput, setEditInput] = useState(isEditModal === true ? editData : defaultInput);
  const editInputKey = ['depth1', 'depth2', 'depth3', 'is_importance', 'description'];
  const availableList = ['O', 'X'];

  const modalClose = () => setAddEditModalSwitch(false);

  const saveData = () => {
    let body = {
      analysis_company_info_id: companyInfoData.analysis_id,
      corp_code: searchCorpCode,
      ...editInput,
    };
    // console.log(body);

    const isDuplicate = checkDuplicate();
    const editUnderDepth = checkEditUnderDepth();
    if (isDuplicate === 1) {
      alert('중복된 데이터가 있습니다');
    } else if (isEditModal && editUnderDepth) {
      alert('추가하기를 이용해주세요(수정 - 하위부문 추가 알림)');
    } else {
      // 부문1 검사
      // eslint-disable-next-line no-lonely-if
      if (body.depth1 === '') {
        alert('부문1 추가가 필요합니다!');
      } else {
        // 부문2 검사
        // eslint-disable-next-line no-lonely-if
        if (body.depth2 === '' && body.depth3 !== '') {
          alert('부문2 추가가 필요합니다!');
        } else {
          // 수정 => depth 어느 부분 수정 확인
          if (isEditModal) {
            const checkEdit = checkEditDepth();
            body = { ...body, ...checkEdit };
            // 추가 => depth1, depth2 중복 확인
          } else {
            const isDepthDuplicate = checkDepthDuplicate();
            body.isDepthDuplicate = isDepthDuplicate;
          }
          // console.log(body);
          const mode = isEditModal === true ? 'edit' : 'add';

          axios
            .post(`${url}/admin/company/sector/individual/info/sector/${mode}`, body)
            .then(() => {
              alert(isEditModal === true ? '수정이 완료되었습니다' : '추가가 완료되었습니다');
              setRefreshSwitch(!refreshSwitch);
              modalClose();
            });
        }
      }
    }
  };

  // 동일한 input이 있는지 체크
  const checkDuplicate = () => {
    let checkDuplicateArray = [];

    if (isEditModal) {
      checkDuplicateArray = sectorInfoData.filter(
        data =>
          data.depth1 === editInput.depth1 &&
          data.depth2 === editInput.depth2 &&
          data.depth3 === editInput.depth3 &&
          data.id !== editData.id,
      );
    } else {
      checkDuplicateArray = sectorInfoData.filter(
        data =>
          data.depth1 === editInput.depth1 &&
          data.depth2 === editInput.depth2 &&
          data.depth3 === editInput.depth3,
      );
    }

    return checkDuplicateArray.length;
  };

  // edit으로 하위 depth 추가하는 것인지 확인
  const checkEditUnderDepth = () => {
    let checkUnderDepth = false;
    if (editData.depth2 === '' && editInput.depth2 !== '') {
      checkUnderDepth = true;
    }
    if (editData.depth3 === '' && editInput.depth3 !== '') {
      checkUnderDepth = true;
    }

    return checkUnderDepth;
  };

  // depth123 중 어느 곳을 수정하였는지 확인 및 원본 저장
  const checkEditDepth = () => {
    const checkEdit = { depth1Original: '', depth2Original: '', depth3Original: '' };
    if (editData.depth1 !== editInput.depth1) {
      checkEdit.depth1Original = editData.depth1;
    }
    if (editData.depth2 !== editInput.depth2) {
      checkEdit.depth2Original = editData.depth2;
    }
    if (editData.depth3 !== editInput.depth3) {
      checkEdit.depth3Original = editData.depth3;
    }
    return checkEdit;
  };

  // depth1, depth2에 중복이 있는지 체크
  const checkDepthDuplicate = () => {
    let depthDuplicate = 0;
    // depth2까지만 입력 (depth1 체크)
    if (editInput.depth2 !== '' && editInput.depth3 === '') {
      const checkDepth1DuplicateArray = sectorInfoData.filter(
        data => data.depth1 === editInput.depth1,
      );
      if (checkDepth1DuplicateArray.length !== 0) {
        depthDuplicate = 1;
      }

      // depth 3까지 입력 (depth1, 2 체크)
    } else if (editInput.depth2 !== '' && editInput.depth3 !== '') {
      const checkDepth1DuplicateArray = sectorInfoData.filter(
        data => data.depth1 === editInput.depth1,
      );
      if (checkDepth1DuplicateArray.length !== 0) {
        depthDuplicate = 1;
      }

      const checkDepth2DuplicateArray = sectorInfoData.filter(
        data => data.depth1 === editInput.depth1 && data.depth2 === editInput.depth2,
      );
      if (checkDepth2DuplicateArray.length !== 0) {
        depthDuplicate = 2;
      }
    }
    return depthDuplicate;
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
            <Box sx={{ mb: '20px' }}>부문 추가</Box>
          </Typography>
          {editField.map(function (each, index) {
            return (
              <Stack key={each} direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: '90px' }}>
                  <h4>{each}</h4>
                </Box>
                {index === 3 ? (
                  <DropDown
                    label={each}
                    selectList={availableList}
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

AddEditInputSectorModal.defaultProps = {
  addEditModalSwitch: true,
  setAddEditModalSwitch: () => {},
  editData: {},
  sectorInfoData: [],
  refreshSwitch: true,
  setRefreshSwitch: () => {},
  isEditModal: true,
  companyInfoData: {},
};

AddEditInputSectorModal.propTypes = {
  addEditModalSwitch: PropTypes.bool,
  setAddEditModalSwitch: PropTypes.func,
  // eslint-disable-next-line
  editData: PropTypes.object,
  // eslint-disable-next-line
  sectorInfoData: PropTypes.array,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
  isEditModal: PropTypes.bool,
  // eslint-disable-next-line
  companyInfoData: PropTypes.object,
};
