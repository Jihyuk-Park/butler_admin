import React from 'react';
import axios from 'axios';
import { Button, Box } from '@mui/material';
import { url } from '../../../component/commonVariable';

export default function SearchCompany() {
  const searchComapny = () => {
    axios
      .get(`${url}/admin/setupCompanyDartReportBatch?bsns_year=2022`)
      .then(result => {
        console.log(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  return (
    <div>
      <Box sx={{ height: '95vh' }}>
        최종 업데이트 <b>2022/10/06 14:00</b>
        <Button variant="contained" color="secondary" onClick={searchComapny} sx={{ ml: '10px' }}>
          기업 탐색 업데이트
        </Button>
      </Box>
    </div>
  );
}
