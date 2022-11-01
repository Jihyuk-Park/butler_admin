import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

/** 드롭 다운 컴포넌트  - selectList => 목록을 담은 배열 (ex) 1분기, 2분기, 3분기, 4분기
 * 상위 컴포넌트에서 관리할 staet는 value, onChange에 주입 */
export default function DropDown({ label, selectList, value, name, onChange, p, fixedWidth }) {
  return (
    <FormControl sx={{ minWidth: '100px' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        // (optional) name은 다수의 input안에서 활용 시, 다수 input 관리를 위한 name
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        SelectDisplayProps={{
          style: { padding: p, backgroundColor: '#FFF', width: fixedWidth },
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
  fixedWidth: '',
  selectList: [],
  value: '',
  onChange: () => {},
  p: '10px 50px 10px 15px',
};

DropDown.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  fixedWidth: PropTypes.string,
  selectList: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  p: PropTypes.string,
};
