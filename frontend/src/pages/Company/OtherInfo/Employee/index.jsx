import React from 'react';
import { Paper, Table, TableHead, TableRow, TableBody, TableContainer } from '@mui/material';
import PeriodTableCell from '../../../../component/UI/PeriodTableCell';
import { periodArrayAuto } from '../../../../component/commonFunction';
import BoundaryTableRow from '../../../../component/UI/BoundaryTableRow';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';
import RawReportsEmployee from './RawReportsEmployee';
import QuarterReportsEmployee from './QuarterReportsEmployee';
import AccumulReportsEmployee from './AccumulReportsEmployee';

export default function Employee() {
  const periodArray = periodArrayAuto();

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/OtherInfo/Employee" />

      <TableContainer
        id="table"
        component={Paper}
        sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['직원 내역', ...periodArray].map(function (eachdata, index) {
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
            <RawReportsEmployee />
            <BoundaryTableRow title="임직원 (분기)" />
            <QuarterReportsEmployee />
            <BoundaryTableRow title="임직원 (1년)" />
            <AccumulReportsEmployee />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
