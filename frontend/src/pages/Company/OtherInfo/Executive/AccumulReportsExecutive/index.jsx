import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PeriodTableCell from '../../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../component/commonVariable';
import {
  periodArrayAuto,
  divideAndComma,
  changeKeyName,
  decimalPercent,
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function AccumulReportsExecutive() {
  const { searchCorpCode } = useParams();

  // 계정 array
  const accumulReportsExecutiveAccountArray = [
    '급여총액 (백만)',
    '1인 평균 (백만)',
    '매출액대비 임원급여 비율',
  ];

  // 배당 데이터
  const [accumulReportsExecutiveData, setAccumulReportsExecutiveData] = useState(
    accumulReportsExecutiveAccountArray,
  );
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(accumulReportsExecutiveData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/executive/getData/search/accumulteReports/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data !== 'X') {
            setAccumulReportsExecutiveData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {accumulReportsExecutiveData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={`1년${accumulReportsExecutiveAccountArray[index]}`}>
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
              {accumulReportsExecutiveAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period, periodIndex) {
              return (
                <PeriodTableCell
                  align="right"
                  key={`${eachdata}${period}`}
                  sx={[periodIndex % 4 === 3 ? { borderRight: '0.8px solid #A9A9A9' } : {}]}
                >
                  {index === 0 || index === 1
                    ? divideAndComma(eachdata[changeKeyName(period)], 1000000, 0)
                    : null}
                  {index === 2 ? decimalPercent(eachdata[changeKeyName(period)]) : null}
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
