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
  divideAndComma,
  decimalPercent,
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function QuarterReportsEmployee() {
  const { searchCorpCode } = useParams();

  // 계정
  const quarterReportsEmployeeAccountArray = [
    '인원수 변화(남)',
    '급여총액(남)',
    '1인 평균(남)',
    '인원수 변화(여)',
    '급여총액(여)',
    '1인 평균(여)',
    '인원수 변화(전체)',
    '급여총액(전체)',
    '1인 평균(전체)',
    '매출액 대비 급여 비율',
    '영업이익대비 급여 비율',
  ];

  // 배당 데이터
  const [quarterReportsEmployeeData, setQuarterReportsEmployeeData] = useState(
    quarterReportsEmployeeAccountArray,
  );
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(quarterReportsEmployeeData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/employee/getData/search/quarterReports/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data !== 'X') {
            setQuarterReportsEmployeeData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {quarterReportsEmployeeData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={`${quarterReportsEmployeeAccountArray[index]}`}>
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
              {quarterReportsEmployeeAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period) {
              return (
                <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                  {index % 3 === 0 && index !== 9
                    ? addComma(eachdata[changeKeyName(period)])
                    : null}
                  {index % 3 === 1 && index !== 10
                    ? divideAndComma(eachdata[changeKeyName(period)], 1000000000, 1)
                    : null}
                  {index % 3 === 2
                    ? divideAndComma(eachdata[changeKeyName(period)], 1000000, 0)
                    : null}
                  {index === 9 || index === 10
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
