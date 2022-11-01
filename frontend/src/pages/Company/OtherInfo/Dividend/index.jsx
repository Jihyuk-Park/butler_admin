import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Button,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
} from '@mui/material';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import { url } from '../../../../component/commonVariable';
import { periodArrayAuto } from '../../../../component/commonFunction';
import RawReportsDividend from './RawReportsDividend';
import QuarterDividend from './QuarterDividend';
import BoundaryTableRow from '../../../../component/UI/BoundaryTableRow';
import AccumulDividend from './AccumulDividend';

export default function Dividend() {
  const navigate = useNavigate();

  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  const periodArray = periodArrayAuto();

  const searchData = () => {
    navigate(`${url}/Company/OtherInfo/Dividend/${searchCompanyCode}`);
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
        </Stack>
      </Grid>
      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['배당(연간누적)', ...periodArray].map(function (eachdata, index) {
                return (
                  <StyledTableCell
                    key={eachdata}
                    align="center"
                    sx={[
                      index === 0
                        ? { minWidth: 180, position: 'sticky', left: 0, zIndex: 100 }
                        : null,
                    ]}
                  >
                    {eachdata}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <RawReportsDividend />
            <BoundaryTableRow title="배당(분기)" />
            <QuarterDividend />
            <BoundaryTableRow title="배당(최근 4분기)" />
            <AccumulDividend />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
