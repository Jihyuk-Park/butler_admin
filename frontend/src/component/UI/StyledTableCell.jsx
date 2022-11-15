import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

/** 공통적으로 쓰고 있는 TableCell  */
export default styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#888888',
    color: theme.palette.common.white,
    fontSize: 15,
    padding: '10px 0px',
    borderSpacing: 0,
    borderCollaspe: 'collapse',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: '10px 10px',
  },
}));
