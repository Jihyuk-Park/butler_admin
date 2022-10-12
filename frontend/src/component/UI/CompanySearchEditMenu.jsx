import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Typography, Button } from '@mui/material';
import CompanyListAutoComplete from '../CompanyListAutoComplete';

export default function CompanySearchEditMenu({ setSearchCompanyCode, searchData }) {
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body" sx={{ ml: '10px' }}>
          기업명
        </Typography>
        <CompanyListAutoComplete onChangeCompanyCode={setSearchCompanyCode} minWidth="300px" />
        <Button variant="contained" color="secondary" onClick={searchData}>
          검색
        </Button>
      </Stack>
      <Button variant="contained" color="secondary" sx={{ minWidth: '90px' }}>
        편집
      </Button>
    </Grid>
  );
}

CompanySearchEditMenu.defaultProps = {
  label: '라벨을 입력해주세요',
  selectList: [],
  value: '라벨을 입력해주세요',
  onChange: () => {},
  p: '10px 50px 10px 15px',
};

CompanySearchEditMenu.propTypes = {
  label: PropTypes.string,
  selectList: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  p: PropTypes.string,
};
