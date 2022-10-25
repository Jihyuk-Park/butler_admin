import React, { useState } from 'react';
import { Grid, Button, Stack, Box } from '@mui/material';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import DropDown from '../../../../component/UI/DropDown';
import { YearArrayAuto } from '../../../../component/commonFunction';

export default function Crawling() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  // 검색 input
  const fsDivArray = ['연결', '개별'];
  const yearArray = YearArrayAuto(2015);
  const quarterArray = ['1분기', '2분기', '3분기', '4분기'];
  const financialTypeArray = ['재무상태표', '손익계산서', '현금흐름표'];

  const [searchInput, setSearchInput] = useState({
    fs_div: '연결',
    year: '2022',
    quarter: '1분기',
    financialType: '재무상태표',
  });

  const inputNameArray = [
    ['연결/개별', [fsDivArray, 'fs_div']],
    ['기간', [yearArray, 'year'], [quarterArray, 'quarter']],
    ['재무제표', [financialTypeArray, 'financialType']],
  ];

  const searchData = () => {
    console.log('corp_code : ', searchCompanyCode);
    console.log(searchInput);
  };

  const onChangeInput = (e, key) => {
    setSearchInput({
      ...searchInput,
      [key]: e.target.value,
    });
  };

  return (
    <Grid sx={{ minHeight: '93vh' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: '10px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
        </Stack>
      </Grid>
      {inputNameArray.map(function (each, index) {
        return (
          <Stack key={each[0]} direction="row" spacing={2} alignItems="center" sx={{ mb: '5px' }}>
            <Box sx={{ width: '80px' }}>{each[0]}</Box>
            <DropDown
              label=""
              selectList={each[1][0]}
              value={searchInput[each[1][1]]}
              onChange={e => {
                onChangeInput(e, each[1][1]);
              }}
            />
            {index === 1 ? (
              <DropDown
                label=""
                selectList={each[2][0]}
                value={searchInput[each[2][1]]}
                onChange={e => {
                  onChangeInput(e, each[2][1]);
                }}
              />
            ) : null}
          </Stack>
        );
      })}
      <h2>크롤링 관리 페이지입니다</h2>
    </Grid>
  );
}
