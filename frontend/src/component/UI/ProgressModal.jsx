import React from 'react';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/** 확인과 취소만 있는 모달을 위한 컴포넌트
 * 확인 클릭 시 수행 할 함수는 상위 컴포넌트에서 customFunction이라는 custom함수를 주입 */
export default function ProgressModal() {
  return (
    <div>
      <Modal open>
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
            fontSize="24px"
            fontWeight={600}
            whiteSpace="pre-wrap"
          >
            <Box sx={{ mb: '40px' }}>잠시만 기다려주세요</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
