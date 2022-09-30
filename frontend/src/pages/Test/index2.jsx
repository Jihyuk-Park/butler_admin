import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { url } from '../../component/constVariable';

export default function CompanyListAutoComplete() {
  const [inputText, setInputText] = useState('');
  const [companyListData, setCompnayListData] = useState([]);
  const [autocompleteText, setAutoCompleteText] = useState('');

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

  const clearValue = () => {
    setAutoCompleteText('');
  };

  return (
    <div>
      <Autocomplete
        getOptionLabel={option => option.corp_name || ''}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, value) => setAutoCompleteText(value)}
        value={autocompleteText}
        // onInputChange={(event, newInputValue, reason) => {
        //   console.log('event', event);
        //   console.log('newInput', newInputValue);
        //   console.log('reason', reason);
        // }}
        options={companyListData}
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
      <Button
        onClick={() => {
          console.log(inputText);
          console.log(autocompleteText);
          setInputText('');
        }}
      >
        확인
      </Button>
      <Button onClick={clearValue}>클리어</Button>
    </div>
  );
}
