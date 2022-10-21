import React from 'react';
import Grid from '@mui/material/Grid';
import SalesAndProfit from './SalesAndProfit';

export default function GeographyIndividualPerformance() {
  return (
    <div>
      <Grid sx={{ minHeight: '80vh', pb: '50px' }}>
        <SalesAndProfit type="sales" />
        <SalesAndProfit type="profit" />
      </Grid>
    </div>
  );
}
