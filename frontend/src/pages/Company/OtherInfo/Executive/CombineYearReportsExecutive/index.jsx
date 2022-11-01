import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PeriodTableCell from '../../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../component/commonVariable';
import {
  periodArrayAuto,
  addComma,
  changeKeyName,
  decimalPercent,
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function CombineYearReportsExecutive() {
  const { searchCorpCode } = useParams();

  // 계정 array
  const combineYearReportsExecutiveAccountArray = [
    '급여총액',
    '1인 평균',
    '매출액대비 임원급여 비율',
  ];

  // 배당 데이터
  const [combineYearReportsExecutiveData, setCombineYearReportsExecutiveData] = useState(
    combineYearReportsExecutiveAccountArray,
  );
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(combineYearReportsExecutiveData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/executive/getData/search/combineYearNAccumulate/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data !== 'X') {
            setCombineYearReportsExecutiveData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {combineYearReportsExecutiveData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={`1년${combineYearReportsExecutiveAccountArray[index]}`}>
            <StyledTableCell
              align="center"
              sx={{
                minWidth: 180,
                position: 'sticky',
                left: 0,
                backgroundColor: '#FFFAFA',
                borderRight: '1px solid black',
              }}
            >
              {combineYearReportsExecutiveAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period) {
              return (
                <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                  {index === 0 || index === 1 ? addComma(eachdata[changeKeyName(period)]) : null}
                  {index !== 0 && index !== 1
                    ? decimalPercent(eachdata[changeKeyName(period)])
                    : null}
                </PeriodTableCell>
              );
            })}
          </StyledTableRow>
        );
      })}
      <StyledTableRow />
    </>
  );
}
