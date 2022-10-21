import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, ButtonGroup, Box } from '@mui/material';
import { url } from '../../../../component/commonVariable';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import SectorIndividualInfo from './Info';
import SectorIndividualPerformance from './Performance';

export default function SectorIndividual() {
  const navigate = useNavigate();

  // 기업명 검색 corp_code 관리 (* ir은 stock_code로 연결)
  const [corpCode, setCorpCode] = useState('');

  // 정보, 실적 모드 전환
  const modeList = ['정보', '실적'];
  const [mode, setMode] = useState('정보');

  const searchData = () => {
    navigate(`${url}/Company/Sector/Individual/${corpCode}`);
  };

  const selectMode = select => {
    setMode(select);
  };

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <CompanyListAutoComplete onChangeCompanyCode={setCorpCode} minWidth="300px" />
        <Button variant="contained" color="secondary" onClick={searchData} sx={{ mr: '50px' }}>
          검색
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mt: '15px' }}>
        <ButtonGroup variant="contained" color="secondary">
          {modeList.map(function (each) {
            return (
              <Button
                key={each}
                variant={mode === each ? 'contained' : 'outlined'}
                onClick={() => {
                  selectMode(each);
                }}
                sx={{ fontSize: '16px', width: '100px' }}
              >
                {each}
              </Button>
            );
          })}
        </ButtonGroup>
      </Stack>
      <Box sx={{ mt: '20px', backgroundColor: '#C9C9C9', height: '0.5px' }} />

      {mode === '정보' ? <SectorIndividualInfo /> : <SectorIndividualPerformance />}
    </div>
  );
}
