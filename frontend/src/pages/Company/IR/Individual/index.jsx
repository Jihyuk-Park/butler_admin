import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Stack, Button, Typography } from '@mui/material';
import { url } from '../../../../component/commonVariable';
import { changeDateDash } from '../../../../component/commonFunction';
import CompanyListAutoComplete from '../../../../component/CompanyListAutoComplete';
import Earning from './Earning';
import Presentation from './Presentation';

export default function IRIndividual() {
  const navigate = useNavigate();
  const { searchStockCode } = useParams();

  // 기업명 검색 stock_code 관리 (실적, 프리젠테이션은 copr_code가 아니라 stock_code로 연결)
  const [stockCode, setStockCode] = useState('');
  const [recentData, setRecentData] = useState([]);

  // 최근 작업일과 업데이트 정보를 받아오는 Hook
  useEffect(() => {
    if (searchStockCode !== 'main') {
      axios
        .get(`${url}/admin/company/ir/individual/getData/search/recent/${searchStockCode}`)
        .then(result => {
          // console.log(result.data[0]);
          setRecentData(result.data[0]);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchStockCode]);

  const searchData = () => {
    if (stockCode) {
      navigate(`${url}/Company/IR/Individual/${stockCode}`);
    } else {
      alert('종목코드가 없는 기업입니다');
    }
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <CompanyListAutoComplete onChangeStockCode={setStockCode} minWidth="300px" />
          <Button variant="contained" color="secondary" onClick={searchData}>
            검색
          </Button>
          <Typography fontSize={20} fontWeight={600}>
            {recentData.corp_name}
          </Typography>
          <Typography>최근 작업일 : {changeDateDash(recentData.recent)}</Typography>
        </Stack>
      </Grid>

      <Earning update={changeDateDash(recentData.earning)} />
      <Presentation update={changeDateDash(recentData.presentation)} />
    </div>
  );
}
