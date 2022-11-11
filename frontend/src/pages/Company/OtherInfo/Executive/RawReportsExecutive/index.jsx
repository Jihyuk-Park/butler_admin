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
  scrollRightUseEffect,
} from '../../../../../component/commonFunction';

export default function RawReportsExecutive() {
  const { searchCorpCode } = useParams();

  const rawReportsExecutiveAccountArray = ['인원', '보수총액 (백만)', '1인당 금액 (백만)'];

  // 배당 데이터
  const [rawReportsExecutiveData, setRawReportsExecutiveData] = useState(
    rawReportsExecutiveAccountArray,
  );
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(rawReportsExecutiveData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/otherInfo/executive/getData/search/rawReports/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          if (result.data === 'X') {
            alert('S3에 JSON 파일이 없습니다');
          } else {
            setRawReportsExecutiveData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {rawReportsExecutiveData.map(function (eachdata, index) {
        return (
          <StyledTableRow key={rawReportsExecutiveAccountArray[index]}>
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
              {rawReportsExecutiveAccountArray[index]}
            </StyledTableCell>
            {periodArray.map(function (period, periodIndex) {
              return (
                <PeriodTableCell
                  align="right"
                  key={`${eachdata}${period}`}
                  sx={[periodIndex % 4 === 3 ? { borderRight: '0.8px solid #A9A9A9' } : {}]}
                >
                  {index === 0 ? addComma(eachdata[changeKeyName(period)]) : null}
                  {index !== 0 ? divideAndComma(eachdata[changeKeyName(period)], 1000000, 0) : null}
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
