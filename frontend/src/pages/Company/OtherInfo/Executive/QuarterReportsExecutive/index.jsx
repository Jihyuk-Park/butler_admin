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
  divideAndComma,
  changeKeyName,
  decimalPercent,
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function QuarterReportsExecutive() {
  const { searchCorpCode } = useParams();

  // 계정
  const quarterReportsExecutiveAccountArray = [
    '임원수',
    '급여총액 (백만)',
    '임원수비율',
    '전체급여대비 임원급여 비율',
    '매출액대비 임원급여 비율',
    '영업이익대비 임원급여 비율',
  ];

  // 배당 데이터
  const [quarterReportsExecutiveData, setQuarterReportsExecutiveData] = useState(
    quarterReportsExecutiveAccountArray,
  );
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(quarterReportsExecutiveData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/executive/getData/search/quarterReports/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data !== 'X') {
            setQuarterReportsExecutiveData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {quarterReportsExecutiveData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={`${quarterReportsExecutiveAccountArray[index]}`}>
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
              {quarterReportsExecutiveAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period, periodIndex) {
              return (
                <PeriodTableCell
                  align="right"
                  key={`${eachdata}${period}`}
                  sx={[periodIndex % 4 === 3 ? { borderRight: '0.8px solid #A9A9A9' } : {}]}
                >
                  {index === 0 ? addComma(eachdata[changeKeyName(period)]) : null}
                  {index === 1 ? divideAndComma(eachdata[changeKeyName(period)], 1000000, 0) : null}
                  {index !== 0 && index !== 1
                    ? decimalPercent(eachdata[changeKeyName(period)], 1)
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
