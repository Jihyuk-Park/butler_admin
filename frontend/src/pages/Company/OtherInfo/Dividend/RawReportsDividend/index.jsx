import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PeriodTableCell from '../../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../component/commonVariable';
import { periodArrayAuto, addComma, changeKeyName } from '../../../../../component/commonFunction';

export default function RawReportsDividend() {
  const { searchCorpCode } = useParams();
  const rawReportsDividendAccountArray = [
    '주당액면가액(원)',
    '(연결)당기순이익',
    '(별도)당기순이익',
    '(연결)주당순이익',
    '현금배당금총액(백만원)',
    '주식배당금총액(백만원)',
    '(연결)현금배당성향(%)',
    '보통주 주당 배당금(원)',
    '보통주 수정주당배당금',
    '보통주 배당수익율(%) ',
    '보통주 주당 주식배당금(주)',
    '보통주 주식배당수익율(%)',
    '우선주 주당 배당금(원)',
    '우선주 수정주당배당금',
    '우선주 현금배당수익율(%)',
    '우선주 주당 주식배당금(주)',
    '우선주 주식배당수익율(%)',
  ];

  // 배당 데이터
  const [rawReportsDividendData, setRawReportsDividendData] = useState(
    rawReportsDividendAccountArray,
  );
  const periodArray = periodArrayAuto();

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/otherInfo/dividend/getData/search/rawReports/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setRawReportsDividendData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {rawReportsDividendData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={rawReportsDividendAccountArray[index]}>
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
              {rawReportsDividendAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period) {
              return (
                <PeriodTableCell align="right" key={`${eachdata}${period}`}>
                  {index !== 6 && index !== 9 && index !== 11 && index !== 14 && index !== 16
                    ? addComma(eachdata[changeKeyName(period)])
                    : null}
                  {index === 6 || index === 9 || index === 11 || index === 14 || index === 16
                    ? eachdata[changeKeyName(period)]
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
