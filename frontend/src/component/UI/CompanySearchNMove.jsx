import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Button, Stack } from '@mui/material';
import CompanyListAutoComplete from '../CompanyListAutoComplete';

/** 검색한 기업 코드의 url로 이동시키는 기업 검색 컴포넌트
 *  ex) Company/OtherInfo/Stock/main => Company/OtherInfo/Stock/00126380  */
export default function CompanySearchNMove({ navigateTo }) {
  const navigate = useNavigate();

  // 기업명 검색 corp_code 관리
  const [searchCompanyCode, setSearchCompanyCode] = useState('');

  const searchData = () => {
    navigate(`/${navigateTo}/${searchCompanyCode}`);
  };

  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
        <Button variant="contained" color="secondary" onClick={searchData}>
          검색
        </Button>
      </Stack>
    </Grid>
  );
}

CompanySearchNMove.defaultProps = {
  navigateTo: '',
};

CompanySearchNMove.propTypes = {
  navigateTo: PropTypes.string,
};
