import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function DropDown({ label, selectList, value, name, onChange, p }) {
  return (
    <FormControl sx={{ minWidth: '100px' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        SelectDisplayProps={{
          style: { padding: p, backgroundColor: '#FFF' },
        }}
      >
        {selectList.map(function (eachdata) {
          return (
            <MenuItem key={eachdata} value={eachdata}>
              {eachdata}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

DropDown.defaultProps = {
  name: '',
  label: '라벨을 입력해주세요',
  selectList: [],
  value: '',
  onChange: () => {},
  p: '10px 50px 10px 15px',
};

DropDown.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  selectList: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  p: PropTypes.string,
};
