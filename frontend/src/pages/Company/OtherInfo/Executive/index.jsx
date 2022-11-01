import React from 'react';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import StyledTableCell from '../../../../component/UI/StyledTableCell';
import { periodArrayAuto } from '../../../../component/commonFunction';
import BoundaryTableRow from '../../../../component/UI/BoundaryTableRow';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';
import RawReportsExecutive from './RawReportsExecutive';
import QuarterReportsExecutive from './QuarterReportsExecutive';
import CombineYearReportsExecutive from './CombineYearReportsExecutive';

export default function Executive() {
  const periodArray = periodArrayAuto();

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/OtherInfo/Executive" />

      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['임원보수 내역', ...periodArray].map(function (eachdata, index) {
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
            <RawReportsExecutive />
            <BoundaryTableRow title="임원 (분기)" />
            <QuarterReportsExecutive />
            <BoundaryTableRow title="임원 (1년)" />
            <CombineYearReportsExecutive />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
