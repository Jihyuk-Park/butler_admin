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

export default function QuarterDividend() {
  const { searchCorpCode } = useParams();
  const quarterDividendAccountArray = [
    '현금배당금',
    '분기배당금',
    '분기 배당수익율',
    '배당금총액(보고)',
    '분기EPS',
    '배당성향',
    '우선주 주당배당금(원)',
    '우선주 수정주당배당금',
    '우선주 현금배당수익율(%)',
  ];

  // 배당 데이터
  const [quarterDividendData, setQuarterDividendData] = useState(quarterDividendAccountArray);
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(quarterDividendData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          `${url}/admin/company/otherInfo/dividend/getData/search/quarterReports/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setQuarterDividendData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {quarterDividendData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={quarterDividendAccountArray[index]}>
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
              {quarterDividendAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period) {
              return (
                <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                  {index === 2 || index === 5
                    ? decimalPercent(eachdata[changeKeyName(period)])
                    : null}
                  {index !== 2 && index !== 5 && index !== 8
                    ? addComma(eachdata[changeKeyName(period)])
                    : null}
                  {index === 8 && eachdata[changeKeyName(period)]
                    ? `${parseFloat(eachdata[changeKeyName(period)], 10).toFixed(1)}%`
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
