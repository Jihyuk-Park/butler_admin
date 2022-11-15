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
  decimalPercent,
  changeKeyName,
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function AccumulDividend() {
  const { searchCorpCode } = useParams();
  const accumulDividendAccountArray = [
    '1년 배당금',
    '1년 배당수익율',
    '현금배당금총액',
    '1년 EPS',
    '1년 배당성향(순이익 대비)',
    '1년 FCFPS',
    '1년 배당성향(FCF 대비)',
    '우선주 수정주당배당금',
    '우선주 현금배당수익율(%)',
  ];

  // 배당 데이터
  const [accumulDividendData, setAccumulDividendData] = useState(accumulDividendAccountArray);
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(accumulDividendData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/dividend/getData/search/accumulteReports/${searchCorpCode}`,
        )
        .then(result => {
          console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setAccumulDividendData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {accumulDividendData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={accumulDividendAccountArray[index]}>
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
              {accumulDividendAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period) {
              return (
                <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                  {index !== 1 && index !== 4 && index !== 6 && index !== 8
                    ? addComma(eachdata[changeKeyName(period)])
                    : null}
                  {index === 1 || index === 4 || index === 6
                    ? decimalPercent(eachdata[changeKeyName(period)])
                    : null}
                  {index === 8 && eachdata[changeKeyName(period)]
                    ? `${parseFloat(eachdata[changeKeyName(period)]).toFixed(1)}%`
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
