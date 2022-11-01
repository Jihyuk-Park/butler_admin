import React from 'react';
import PropTypes from 'prop-types';
import PeriodTableCell from './PeriodTableCell';
import StyledTableCell from './StyledTableCell';
import StyledTableRow from './StyledTableRow';
import { periodArrayAuto } from '../commonFunction';

/** 경계를 나타내기 위한 테이블 로우 (배경색 및 상하단 경계선, 첫 열에만 title 내용 외에는 값x) */
export default function BoundaryTableRow({ title }) {
  const periodArray = periodArrayAuto();

  return (
    <StyledTableRow>
      <StyledTableCell
        align="center"
        sx={{
          minWidth: 180,
          position: 'sticky',
          left: 0,
          backgroundColor: '#D9E1F2',
          borderRight: '1px solid black',
          borderTop: '1px solid black',
          borderBottom: '1px solid black',
          fontWeight: 700,
        }}
      >
        {title}
      </StyledTableCell>
      {periodArray.map(function (period) {
        return (
          <PeriodTableCell
            key={`${title}${period}`}
            sx={{
              backgroundColor: '#D9E1F2',
              borderTop: '1px solid black',
              borderBottom: '1px solid black',
            }}
          >
            {null}
          </PeriodTableCell>
        );
      })}
    </StyledTableRow>
  );
}

BoundaryTableRow.defaultProps = {
  title: '',
};

BoundaryTableRow.propTypes = {
  title: PropTypes.string,
};
