import React from 'react';
import Grid from '@mui/material/Grid';
import Sales from './Sales';

export default function SectorIndividualPerformance() {
  return (
    <div>
      <Grid sx={{ minHeight: '80vh' }}>
        <Sales />
      </Grid>
    </div>
  );
}
