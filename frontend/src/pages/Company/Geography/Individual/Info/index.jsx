import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import CompanyInfo from './CompanyInfo';
import GeographyInfo from './GeographyInfo';

export default function GeographyIndividualInfo() {
  const [refreshSwitch, setRefreshSwitch] = useState(false);
  return (
    <div>
      {/* Grid로 4:8 등으로 나눌 시 적용, or 삭제 */}
      <Grid container spacing={2} sx={{ minHeight: '85vh' }}>
        <Grid item xs={12}>
          <CompanyInfo refreshSwitch={refreshSwitch} setRefreshSwitch={setRefreshSwitch} />
        </Grid>
        <Grid item xs={12}>
          <GeographyInfo refreshSwitch={refreshSwitch} setRefreshSwitch={setRefreshSwitch} />
        </Grid>
      </Grid>
    </div>
  );
}
