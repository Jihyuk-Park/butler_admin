import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { url } from '../commonVariable';

export default function CompanyListAutoComplete({
  onChangeCompanyName,
  onChangeCompanyCode,
  clearSwitch,
  minWidth,
}) {
  const [inputText, setInputText] = useState('');
  const [companyListData, setCompnayListData] = useState([]);
  const [autocompleteText, setAutoCompleteText] = useState('');

  // 부모 컴포넌트에서 초기화를 위한 훅
  useEffect(() => {
    clearAutoComplete();
  }, [clearSwitch]);

  useEffect(() => {
    if (inputText.length !== 0) {
      axios
        .get(`${url}/admin/common/getCompanyList/${inputText}`)
        .then(result => {
          // console.log(result.data);
          setCompnayListData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [inputText]);

  const onChangeInput = e => {
    setInputText(e.target.value);
  };

  const onChangeAutoComplete = (event, value) => {
    setAutoCompleteText(value);
    if (value) {
      onChangeCompanyName(value.corp_name);
      onChangeCompanyCode(value.corp_code);
    }
  };

  const clearAutoComplete = () => {
    setAutoCompleteText('');
  };

  return (
    <Autocomplete
      // corp_name을 목록으로
      getOptionLabel={option => option.corp_name || ''}
      // 없으면 warning
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value) => onChangeAutoComplete(event, value)}
      options={companyListData}
      value={autocompleteText}
      // eslint-disable-next-line object-shorthand
      sx={{ minWidth: minWidth }}
      renderOption={(props, option) => {
        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Box {...props} key={option.corp_code}>
            {option.corp_name}
          </Box>
        );
      }}
      renderInput={params => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <TextField {...params} label="Company" onChange={onChangeInput} value={inputText} />
      )}
    />
  );
}

CompanyListAutoComplete.defaultProps = {
  onChangeCompanyName: () => {},
  onChangeCompanyCode: () => {},
  clearSwitch: 0,
  minWidth: '100px',
};

CompanyListAutoComplete.propTypes = {
  onChangeCompanyName: PropTypes.func,
  onChangeCompanyCode: PropTypes.func,
  clearSwitch: PropTypes.number,
  minWidth: PropTypes.string,
};
