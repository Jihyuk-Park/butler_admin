import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { url } from '../commonVariable';

export default function CompanyEditModal({
  editModalSwtich,
  setEditModalSwitch,
  where,
  editAccountArray,
  searchCompanyCode,
  refreshFunction,
  // dividend의 se와 같이 account가 따로 존재하는 필드의 경우
  // executive와 같이 따로 존재하지 않는 경우
  isAccountFieldExist,
}) {
  // 기간 목록 및 선택된 버튼 & 기간 state 관리
  const [periodList, setPeriodList] = useState([]);
  const [selectedButton, setSelectedButton] = useState(100);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  // input 관리
  const [editInput, setEditInput] = useState({});
  const editInputNameArray = [...editAccountArray];
  // 원본 데이터
  const [loadData, setLoadData] = useState([]);

  useEffect(() => {
    const tempObj = {};
    editAccountArray.map(function (each) {
      tempObj[each] = '';
      return null;
    });
    setEditInput(tempObj);
  }, []);

  useEffect(() => {
    axios
      .get(`${url}/${where}/getPeriodList/${searchCompanyCode}`)
      .then(result => {
        setPeriodList(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, []);

  const selectPeriod = (ind, period) => {
    setSelectedButton(ind);
    setSelectedPeriod(period);
    const year = `20${period.substring(1, 3)}`;
    const quarter = period.substring(4, 5);
    // console.log(year, quarter);
    axios
      .get(`${url}/${where}/getData/period/${searchCompanyCode}/${year}/${quarter}`)
      .then(result => {
        // dividend의 se와 같이 account가 따로 존재하는 필드의 경우
        if (isAccountFieldExist) {
          const tempMap = { ...editInput };
          result.data.map(function (each) {
            tempMap[each.name] = each.value;
            return null;
          });
          // console.log(tempMap);
          setLoadData(result.data);
          setEditInput(tempMap);
          // executive와 같이 따로 존재하지 않는 경우
        } else {
          setEditInput(result.data[0]);
          setLoadData(result.data[0]);
        }
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  const onChangeEditInput = e => {
    const { name, value } = e.target;
    // console.log(name, value);
    setEditInput({
      ...editInput,
      [name]: value,
    });
  };

  const saveData = () => {
    let body;
    if (isAccountFieldExist) {
      body = [];
      Object.entries(editInput).map(function (each) {
        // 새로운 계정 insert (불러온 loadData에는 계정명이 없으면서 값이 기본 값인 ''이 아닌 것)
        const temp1 = loadData.filter(data => data.name === each[0]);
        if (temp1.length === 0 && each[1] !== '') {
          body.push({ name: each[0], value: each[1], type: 'INSERT' });
        }
        // 기존 자료 update (계정명, 이름은 있는데 값이 달라진 것)
        const temp2 = loadData.filter(data => data.name === each[0] && data.value !== each[1]);
        if (temp2.length !== 0) {
          body.push({ name: each[0], value: each[1], type: 'UPDATE' });
        }
        return null;
      });
    } else {
      body = { ...editInput };
    }

    // console.log(body);

    const year = `20${selectedPeriod.substring(1, 3)}`;
    const quarter = selectedPeriod.substring(4, 5);

    axios
      .post(`${url}/${where}/editData/period/${searchCompanyCode}/${year}/${quarter}`, body)
      .then(res => {
        alert(res.data);
        modalClose();
        refreshFunction();
      });
  };

  const modalClose = () => setEditModalSwitch(false);

  return (
    <div>
      <Modal open={editModalSwtich} onClose={modalClose}>
        <Box
          sx={{
            width: 800,
            height: { lg: 550, xl: 650 },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'scroll',
            bgcolor: '#F8F8F8',
            border: '1px solid #B8B8B8;',
            borderRadius: '4px',
            p: '40px 100px 40px 100px',
            outline: 'none',
          }}
        >
          <Typography
            component="div"
            align="center"
            color="#333333"
            fontSize="26px"
            fontWeight={600}
          >
            <Box sx={{ mb: '35px' }}>DATA 수정</Box>
          </Typography>

          <Typography component="div" fontSize={20} fontWeight={600}>
            <Grid container direction="row" justifyContent="space-between">
              <Box sx={{ ml: '17px' }}>기간</Box>
              <Box sx={{ ml: '70px' }}>계정명</Box>
              <Box sx={{ ml: '70px' }}>원본 값</Box>
              <Box sx={{ mr: '50px' }}>수정 데이터</Box>
            </Grid>
          </Typography>

          <Box sx={{ height: '0.5px', backgroundColor: '#10263B', my: '15px' }} />

          {/* 수정 부분 */}
          <Grid container columnSpacing={2} sx={{ mb: '30px' }}>
            <Grid item xs={3}>
              {periodList.map(function (eachdata, index) {
                const temp = `'${eachdata.bsns_year.substring(2, 4)}Q${eachdata.quarter_id}`;
                return (
                  <Box key={temp} sx={{ mb: '5px' }}>
                    <Button
                      variant={selectedButton === index ? 'contained' : 'outlined'}
                      color="secondary"
                      onClick={() => selectPeriod(index, temp)}
                    >
                      {temp}
                    </Button>
                  </Box>
                );
              })}
            </Grid>
            <Grid item xs={9} sx={{ mt: '10px' }}>
              {editAccountArray.map(function (eachdata, index) {
                let temp = {};
                if (isAccountFieldExist) {
                  loadData.forEach(val => {
                    if (val.name === eachdata) {
                      temp = val;
                      // console.log(val.name);
                    }
                  });
                } else {
                  temp = { ...loadData };
                }
                return (
                  <Grid
                    container
                    key={eachdata}
                    direction="row"
                    justifyContent="space-between"
                    alignContent="center"
                    spacing={1}
                    sx={{ mb: '10px' }}
                  >
                    <Typography sx={{ mt: '5px' }}>{eachdata}</Typography>
                    <Box>
                      {isAccountFieldExist === true ? (
                        <TextField value={temp.value || ''} disabled sx={{ mr: '10px' }} />
                      ) : (
                        <TextField value={temp[eachdata] || ''} disabled sx={{ mr: '10px' }} />
                      )}
                      <TextField
                        value={editInput[eachdata] || ''}
                        disabled={selectedPeriod === ''}
                        onChange={e => onChangeEditInput(e, eachdata)}
                        name={editInputNameArray[index]}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" onClick={saveData} sx={{ color: 'white', mr: '10px' }}>
              수정
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

CompanyEditModal.defaultProps = {
  editModalSwtich: true,
  isAccountFieldExist: true,
  where: '',
  searchCompanyCode: '',
  setEditModalSwitch: () => {},
  editAccountArray: [],
  refreshFunction: () => {},
};

CompanyEditModal.propTypes = {
  editModalSwtich: PropTypes.bool,
  isAccountFieldExist: PropTypes.bool,
  where: PropTypes.string,
  searchCompanyCode: PropTypes.string,
  setEditModalSwitch: PropTypes.func,
  editAccountArray: PropTypes.arrayOf(PropTypes.string),
  refreshFunction: PropTypes.func,
};
