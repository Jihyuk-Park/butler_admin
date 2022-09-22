import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

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
            width: 330,
            height: 100,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#F8F8F8',
            border: '1px solid #B8B8B8;',
            borderRadius: '4px',
            p: '28px 20px 25px 20px',
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
