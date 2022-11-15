import React from 'react';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import PeriodTableCell from '../../../../component/UI/PeriodTableCell';
import { periodArrayAuto } from '../../../../component/commonFunction';
import RawReportsDividend from './RawReportsDividend';
import QuarterDividend from './QuarterDividend';
import BoundaryTableRow from '../../../../component/UI/BoundaryTableRow';
import AccumulDividend from './AccumulDividend';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';

export default function Dividend() {
  const periodArray = periodArrayAuto();

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/OtherInfo/Dividend" />

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
                  <PeriodTableCell
                    key={eachdata}
                    align="center"
                    sx={[
                      index === 0
                        ? { minWidth: 180, position: 'sticky', left: 0, zIndex: 100 }
                        : null,
                    ]}
                  >
                    {eachdata}
                  </PeriodTableCell>
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
