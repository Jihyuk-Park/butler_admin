import React from 'react';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import { periodArrayAuto } from '../../../../component/commonFunction';
import CommonBuyback from './CommonBuyback';
import PreferredBuyback from './PreferredBuyback';
import BoundaryTableRow from '../../../../component/UI/BoundaryTableRow';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';

export default function Buyback() {
  const periodArray = periodArrayAuto();

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/OtherInfo/Buyback" />

      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['자사주 내역(보통주)', ...periodArray].map(function (eachdata, index) {
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
            <CommonBuyback />
            <BoundaryTableRow title="자사주 내역(우선주)" />
            <PreferredBuyback />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
