import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

/** 15Q1 ~ 22Q2까지의 TableCell  */
export default styled(TableCell)(({ theme }) => ({
  // 기타 정보 헤더 (4n + 3마다 오른쪽 선)
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#888888',
    color: theme.palette.common.white,
    fontSize: 15,
    padding: '10px 0px',
    minWidth: 40,
    '&:nth-of-type(4n + 3)': {
      borderRight: '0.8px solid #A9A9A9',
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: '10px 10px',
    minWidth: 40,
    '&:nth-of-type(4n + 3)': {
      borderRight: '0.8px solid #A9A9A9',
    },
  },
}));
