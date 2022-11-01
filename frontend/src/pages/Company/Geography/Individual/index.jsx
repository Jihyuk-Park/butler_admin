import React, { useState } from 'react';
import { Stack, Button, ButtonGroup, Box } from '@mui/material';
import GeographyIndividualInfo from './Info';
import GeographyIndividualPerformance from './Performance';
import CompanySearchNMove from '../../../../component/UI/CompanySearchNMove';

export default function GeographyIndividual() {
  // 정보, 실적 모드 전환
  const modeList = ['정보', '실적'];
  const [mode, setMode] = useState('정보');

  const selectMode = select => {
    setMode(select);
  };

  return (
    <div>
      <CompanySearchNMove navigateTo="Company/Geography/Individual" />

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

      {mode === '정보' ? <GeographyIndividualInfo /> : <GeographyIndividualPerformance />}
    </div>
  );
}
