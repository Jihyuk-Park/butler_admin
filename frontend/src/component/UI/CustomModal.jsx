import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

/** 확인과 취소만 있는 모달을 위한 컴포넌트
 * 확인 클릭 시 수행 할 함수는 상위 컴포넌트에서 customFunction이라는 custom함수를 주입 */
export default function CustomModal({
  customModalSwitch,
  setCustomModalSwitch,
  message,
  customFunction,
}) {
  const modalClose = () => setCustomModalSwitch(false);

  return (
    <div>
      <Modal open={customModalSwitch} onClose={modalClose}>
        <Box
          sx={{
            width: 350,
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
            <Box sx={{ mb: '20px' }}>{message}</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={customFunction}
              sx={{ color: 'white', mr: '10px' }}
            >
              확인
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

CustomModal.defaultProps = {
  customModalSwitch: true,
  setCustomModalSwitch: () => {},
  message: '메세지를 입력해주세요.',
  customFunction: () => {},
};

CustomModal.propTypes = {
  customModalSwitch: PropTypes.bool,
  setCustomModalSwitch: PropTypes.func,
  message: PropTypes.string,
  customFunction: PropTypes.func,
};
