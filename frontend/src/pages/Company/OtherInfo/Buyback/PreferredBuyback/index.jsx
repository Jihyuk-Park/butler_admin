import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PeriodTableCell from '../../../../../component/UI/PeriodTableCell';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../component/commonVariable';
import {
  scrollRightUseEffect,
  periodArrayAuto,
  addComma,
  changeKeyName,
} from '../../../../../component/commonFunction';

export default function PreferredBuyback() {
  const { searchCorpCode } = useParams();

  // [0] => 계정 표시, [1] => unique key를 위한
  const buybackAccountArray = [
    ['직접취득', '항목'],
    ['기초', '직접취득'],
    ['변동', '직접취득'],
    ['기말', '직접취득'],
    ['신탁계약', '항목'],
    ['기초', '신탁계약'],
    ['변동', '신탁계약'],
    ['기말', '신탁계약'],
    ['기타', '항목'],
    ['기초', '기타'],
    ['변동', '기타'],
    ['기말', '기타'],
    ['합계', '항목'],
    ['기초', '합계'],
    ['취득', '합계'],
    ['처분', '합계'],
    ['소각', '합계'],
    ['변동', '합계'],
    ['기말', '합계'],
  ];

  // 소액주주 데이터
  const [buybackData, setBuybackData] = useState(buybackAccountArray);
  const periodArray = periodArrayAuto();

  scrollRightUseEffect(buybackData);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(
          // json 데이터가 preferred가 아닌 prefered (오타 추정)
          `${url}/admin/company/otherInfo/buyback/getData/search/rawReports/prefered/${searchCorpCode}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data !== 'X') {
            setBuybackData(result.data);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <>
      {buybackData.map(function (eachdata, index) {
        return (
          <StyledTableRow
            key={`우선주${buybackAccountArray[index][1]}${buybackAccountArray[index][0]}`}
          >
            <StyledTableCell
              align={index === 0 || index === 4 || index === 8 || index === 12 ? 'center' : 'right'}
              sx={{
                minWidth: 180,
                position: 'sticky',
                left: 0,
                backgroundColor: '#FFFAFA',
                borderRight: '1px solid black',
              }}
            >
              {buybackAccountArray[index][0]}
            </StyledTableCell>
            {periodArray.map(function (period, periodIndex) {
              return (
                <PeriodTableCell
                  align="right"
                  key={`${eachdata}${period}`}
                  sx={[periodIndex % 4 === 3 ? { borderRight: '0.8px solid #A9A9A9' } : {}]}
                >
                  {addComma(eachdata[changeKeyName(period)])}
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
