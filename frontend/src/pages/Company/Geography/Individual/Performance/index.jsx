import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { url } from '../../../../../component/commonVariable';
import SalesAndProfit from './SalesAndProfit';

export default function GeographyIndividualPerformance() {
  const { searchCorpCode } = useParams();
  const [infoData, setInfoData] = useState({});

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/geography/individual/info/company/getData/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          setInfoData(result.data[0]);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  return (
    <div>
      <Grid sx={{ minHeight: '80vh', pb: '50px' }}>
        {/* 정보1,2 및 unit 불러온 후 데이터 로드 */}
        {infoData.analysis_id !== undefined ? (
          <div>
            <SalesAndProfit infoData={infoData} type="1" searchCorpCode={searchCorpCode} />
            <SalesAndProfit infoData={infoData} type="2" searchCorpCode={searchCorpCode} />
          </div>
        ) : null}
      </Grid>
    </div>
  );
}
