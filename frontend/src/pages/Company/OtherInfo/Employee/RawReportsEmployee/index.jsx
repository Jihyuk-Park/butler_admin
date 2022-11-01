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
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function RawReportsEmployee() {
  const { searchCorpCode } = useParams();

  // [0] => 계정 표시, [1] => unique key를 위한
  const rawReportsEmployeeAccountArray = [
    ['남', '항목'],
    ['근속연수', '남'],
    ['급여총액(십억)', '남'],
    ['1인평균(백만)', '남'],
    ['여', '항목'],
    ['근속연수', '여'],
    ['급여총액(십억)', '여'],
    ['1인평균(백만)', '여'],
    ['합계', '항목'],
    ['근속연수', '합계'],
    ['급여총액(십억)', '합계'],
    ['1인평균(백만)', '합계'],
  ];

  // 배당 데이터
  const [rawReportsEmployeeData, setRawReportsEmployeeData] = useState(
    rawReportsEmployeeAccountArray,
  );
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(rawReportsEmployeeData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/otherInfo/employee/getData/search/rawReports/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setRawReportsEmployeeData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {rawReportsEmployeeData.map(function (eachdata, index) {
        return (
          <StyledTableRow
            key={`${rawReportsEmployeeAccountArray[index][1]}${rawReportsEmployeeAccountArray[index][0]}`}
          >
            <StyledTableCell
              align={index === 0 || index === 4 || index === 8 ? 'center' : 'right'}
              sx={{
                minWidth: 180,
                position: 'sticky',
                left: 0,
                backgroundColor: '#FFFAFA',
                borderRight: '1px solid black',
              }}
            >
              {rawReportsEmployeeAccountArray[index][0]}
            </StyledTableCell>
            {periodArray.map(function (period) {
              return (
                <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                  {index % 4 === 0 || index % 4 === 1
                    ? addComma(eachdata[changeKeyName(period)])
                    : null}
                  {index % 4 === 2
                    ? divideAndComma(eachdata[changeKeyName(period)], 1000000000, 1)
                    : null}
                  {index % 4 === 3
                    ? divideAndComma(eachdata[changeKeyName(period)], 1000000, 0)
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
