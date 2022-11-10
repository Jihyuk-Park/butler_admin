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
  onChangeStockCode,
  clearSwitch,
  minWidth,
  enterFunc,
}) {
  const [inputText, setInputText] = useState('');
  const [companyListData, setCompanyListData] = useState([]);
  const [autocompleteText, setAutoCompleteText] = useState('');

  // 상위 컴포넌트에서 초기화를 위한 훅 (!clearSwitch를 통해 초기화)
  useEffect(() => {
    clearAutoComplete();
  }, [clearSwitch]);

  // 자동완성 (n글자 이상 시 검색)
  useEffect(() => {
    if (inputText.length >= 2) {
      axios
        .get(`${url}/admin/common/getCompanyList/${inputText}`)
        .then(result => {
          // console.log(result.data);
          setCompanyListData(result.data);
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
      onChangeStockCode(value.stock_code);
    }
  };

  const clearAutoComplete = () => {
    setAutoCompleteText('');
  };

  const onCheckEnter = e => {
    if (e.key === 'Enter') {
      enterFunc();
    }
  };

  return (
    <Autocomplete
      // 받은 데이터들 중 corp_name을 목록으로 보여주는 옵션 (default - option.label)
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
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label="Company"
          onChange={onChangeInput}
          value={inputText}
          onKeyPress={onCheckEnter}
        />
      )}
    />
  );
}

CompanyListAutoComplete.defaultProps = {
  onChangeCompanyName: () => {},
  onChangeCompanyCode: () => {},
  onChangeStockCode: () => {},
  clearSwitch: 0,
  minWidth: '100px',
  enterFunc: () => {},
};

CompanyListAutoComplete.propTypes = {
  onChangeCompanyName: PropTypes.func,
  onChangeCompanyCode: PropTypes.func,
  onChangeStockCode: PropTypes.func,
  clearSwitch: PropTypes.number,
  minWidth: PropTypes.string,
  enterFunc: PropTypes.func,
};
