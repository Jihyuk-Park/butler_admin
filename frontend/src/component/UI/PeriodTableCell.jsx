import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export default styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#888888',
    color: theme.palette.common.white,
    fontSize: 15,
    padding: '10px 0px',
    minWidth: 40,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: '10px 10px',
    minWidth: 40,
  },
}));
