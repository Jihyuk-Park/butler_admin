import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Button, Stack, Box } from '@mui/material';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import DropDown from '../../../../component/UI/DropDown';
import { url } from '../../../../component/commonVariable';
import RawReportsManagement from './RawReportsManagement';
import QuarterReportsManagement from './QuarterReportsManagement';
import AccumulReportsManagement from './AccumulReportsManagement';

export default function Management() {
  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');
  // 검색 조건에 따른 데이터 로드 새로고침 스위치 (검색 클릭 시, !searchRefreshSwitch)
  const [searchRefreshSwitch, setSearchRefreshSwitch] = useState(true);

  // 검색 input
  const fsDivArray = ['연결', '개별'];
  const financialTypeArray = ['재무상태표', '손익계산서', '현금흐름표'];

  const [searchInput, setSearchInput] = useState({
    fs_div: '연결',
    financialType: '재무상태표',
  });

  const inputNameArray = [
    ['연결/개별', [fsDivArray, 'fs_div']],
    ['재무제표', [financialTypeArray, 'financialType']],
  ];

  const searchData = () => {
    if (searchCompanyCode === '') {
      alert('기업을 먼저 선택해주세요!');
    } else {
      setSearchRefreshSwitch(!searchRefreshSwitch);
    }
  };

  const updateS3 = () => {
    if (searchCompanyCode) {
      console.log(searchCompanyCode);
      axios
        .get(`${url}/admin/generateReportAPI/${searchCompanyCode}`)
        .then(result => {
          console.log(result);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      alert('먼저 기업을 선택하세요!');
    }
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
          <Button variant="contained" color="secondary" onClick={updateS3}>
            S3 업데이트
          </Button>
        </Stack>
      </Grid>

      {inputNameArray.map(function (each) {
        return (
          <Stack key={each[0]} direction="row" spacing={2} alignItems="center" sx={{ mb: '5px' }}>
            <Box sx={{ width: '80px' }}>{each[0]}</Box>
            <DropDown
              label=""
              fixedWidth="221px"
              selectList={each[1][0]}
              value={searchInput[each[1][1]]}
              onChange={e => {
                onChangeInput(e, each[1][1]);
              }}
            />
          </Stack>
        );
      })}

      <RawReportsManagement
        searchInput={searchInput}
        searchCompanyCode={searchCompanyCode}
        searchRefreshSwitch={searchRefreshSwitch}
        setSearchRefreshSwitch={setSearchRefreshSwitch}
      />

      <QuarterReportsManagement
        searchInput={searchInput}
        searchCompanyCode={searchCompanyCode}
        searchRefreshSwitch={searchRefreshSwitch}
      />

      <AccumulReportsManagement
        searchInput={searchInput}
        searchCompanyCode={searchCompanyCode}
        searchRefreshSwitch={searchRefreshSwitch}
      />
    </Grid>
  );
}
