import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import {
  Table,
  Grid,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
} from '@mui/material';
import OutLinedBox from '../../component/UI/OutLinedBox';
import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';
import { itemNumber, url } from '../../component/constVariable';

export default function UserInfo() {
  // 유저 정보 데이터 관련
  const dataTable = ['닉네임', '이름', '전화번호', '이메일', '로그인 방식', 'Grade', 'Type', 'Uid'];
  const [userInfoData, setUserInfoData] = useState([]);

  // 무한 스크롤 (ref가 화면에 나타나면 inView는 true, 아니면 false를 반환)
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(100);

  // 검색 관련
  const searchTypeList = ['닉네임', '이름', '로그인 방식', 'Grade', 'Type', 'Uid'];
  const [searchType, setSearchType] = useState('닉네임');
  const [searchInput, setSearchInput] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(true);

  // 수정 관련 (수정 내용이 있는지 비교를 위한 데이터 및 인풋)
  const [originalData, setOriginalData] = useState(['', '', '', '', '', '', '', '']);
  const [isChange, setIsChange] = useState(false);
  const [originalId, setOriginalId] = useState(0);
  const [editInput, setEditInput] = useState({
    editNickName: '',
    editName: '',
    editPhone: '',
    editEmail: '',
    editAuthType: '',
    editGrade: '',
    editType: '',
    editUid: '',
  });
  const {
    editNickName,
    editName,
    editPhone,
    editEmail,
    editAuthType,
    editGrade,
    editType,
    editUid,
  } = editInput;

  const editInputArray = [
    editNickName,
    editName,
    editPhone,
    editEmail,
    editAuthType,
    editGrade,
    editType,
    editUid,
  ];

  const editInputNameArray = [
    'editNickName',
    'editName',
    'editPhone',
    'editEmail',
    'editAuthType',
    'editGrade',
    'editType',
    'editUid',
  ];
  const [editableSwitch, setEditableSwitch] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  // 유저 정보 데이터를 받아오는 Hook
  // 검색 유무에 따라 전체 데이터 혹은 일치하는 데이터
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userInfo/getData/all/${page}`)
        .then(result => {
          // console.log(result.data);
          setUserInfoData([...userInfoData, ...result.data]);
          setLoading(false);
          setIsSearch(false);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userInfo/getData/search/${page}/${searchType}/${searchInput}`)
        .then(result => {
          // console.log(result.data);
          setUserInfoData([...userInfoData, ...result.data]);
          setLoading(false);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [page, refreshSwitch]);

  // 전체 페이지 수 계산을 위한 Hook (무한 스크롤)
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userInfo/getTotalNum/all`)
        .then(result => {
          // console.log(result.data);
          setMaxPage(Math.ceil(result.data.totalnum / itemNumber));
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userInfo/getTotalNum/search/${searchType}/${searchInput}`)
        .then(result => {
          // console.log(result.data);
          setMaxPage(Math.ceil(result.data.totalnum / itemNumber));
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [isSearch, refreshSwitch]);

  // 무한 스크롤 훅 (하단 도달 시 페이지 갱신(+1))
  useEffect(() => {
    if (inView && !loading && page <= maxPage && userInfoData.length !== 0) {
      setLoading(true);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  }, [inView, loading]);

  // 검색 타입 설정
  const selectType = e => {
    setSearchType(e.target.value);
  };

  // 검색어 입력 input
  const searchInputOnChange = e => {
    setSearchInput(e.target.value);
  };

  // 검색 버튼 클릭 (검색어로 데이터 로드)
  const searchUserInfo = () => {
    if (searchInput.length === 0) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
    setUserInfoData([]);
    if (page !== 1) {
      setPage(1);
    } else {
      setPage(1);
      setRefreshSwitch(!refreshSwitch);
    }
    onReset();
    setOriginalData(['', '', '', '', '', '', '', '']);
  };

  // 데이터 클릭 (수정 영역에 데이터 세팅 + 오리지날 데이터 세팅)
  const setEditData = each => {
    setEditInput({
      editNickName: each.NickName,
      editName: each.Name,
      editPhone: each.Phone,
      editEmail: each.EMail,
      editAuthType: each.AuthType,
      editGrade: each.id,
      editType: each.id,
      editUid: each.id,
    });
    setOriginalId(each.id);
    setOriginalData([
      each.NickName,
      each.Name,
      each.Phone,
      each.EMail,
      each.AuthType,
      each.id,
      each.id,
      each.id,
    ]);
    setEditableSwitch([false, false, false, false, false, false, false, false]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsChange(false);
  };

  // 데이터 수정 input
  const onChangeEditInput = e => {
    const { name, value } = e.target;
    setEditInput({
      ...editInput,
      [name]: value,
    });
  };

  // 데이터 수정 input 초기화
  const onReset = () => {
    setEditInput({
      editNickName: '',
      editName: '',
      editPhone: '',
      editEmail: '',
      editAuthType: '',
      editGrade: '',
      editType: '',
      editUid: '',
    });
    setEditableSwitch([false, false, false, false, false, false, false, false]);
    setOriginalData(['', '', '', '', '', '', '', '']);
    setIsChange(false);
  };

  // 데이터 수정 가능 스위치
  const clickEditableSwitch = ind => {
    const tempArray = [...editableSwitch];
    tempArray[ind] = !tempArray[ind];
    setEditableSwitch(tempArray);
    if (editInputArray[ind] === originalData[ind]) {
      setIsChange(false);
    } else {
      setIsChange(true);
    }
  };

  // 수정된 데이터 서버 전송
  const saveData = () => {
    const body = {
      id: originalId,
      NickName: editNickName,
      Name: editName,
      Phone: editPhone,
      Email: editEmail,
      AuthType: editAuthType,
      Grade: editGrade,
      Type: editType,
      Uid: editUid,
    };

    axios.post(`/admin/user/userInfo/edit`, body).then(() => {
      userInfoData.map((eachdata, index) => {
        if (eachdata.id === originalId) {
          const temp = {
            NickName: editNickName,
            Name: editName,
            Phone: editPhone,
            EMail: editEmail,
            AuthType: editAuthType,
            Grade: editGrade,
            Type: editType,
            Uid: editUid,
          };
          Object.assign(userInfoData[index], temp);
        }
        return eachdata;
      });

      setEditInput({
        editNickName: '',
        editName: '',
        editPhone: '',
        editEmail: '',
        editAuthType: '',
        editGrade: '',
        editType: '',
        editUid: '',
      });
    });
  };

  return (
    <Grid container columnSpacing={1}>
      {/* userInfo 표 영역 */}
      <Grid item xs={8}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {dataTable.map(function (eachdata) {
                  return (
                    <StyledTableCell key={eachdata} align="center">
                      {eachdata}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {userInfoData.map(eachdata => (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell align="center" component="th" scope="row">
                    <Button onClick={() => setEditData(eachdata)} color="secondary">
                      {eachdata.NickName}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Name}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.Phone}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.EMail}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.AuthType}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                  <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box ref={ref} sx={{ height: '10px', mt: '30px' }} />
      </Grid>

      <Grid item xs={4}>
        {/* 검색 창 부분 */}
        <Stack direction="row" spacing={1} sx={{ mb: '10px' }}>
          <FormControl>
            <InputLabel>검색타입</InputLabel>
            <Select
              value={searchType}
              label="검색 타입"
              onChange={selectType}
              SelectDisplayProps={{
                style: { padding: '10px 150px 10px 15px', backgroundColor: '#FFF' },
              }}
            >
              {searchTypeList.map(function (eachdata) {
                return (
                  <MenuItem key={eachdata} value={eachdata}>
                    {eachdata}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField fullWidth value={searchInput} onChange={searchInputOnChange} />
          <Button onClick={searchUserInfo} variant="contained" color="secondary">
            검색
          </Button>
        </Stack>

        {/* 수정 영역 */}
        <OutLinedBox>
          {dataTable.map(function (eachdata, index) {
            return (
              <Grid key={eachdata} container alignItems="center" spacing={1} sx={{ mb: '10px' }}>
                <Grid item xs={3}>
                  <Typography fontSize={14} align="left">
                    {eachdata}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    disabled={editableSwitch[index] === false}
                    fullWidth
                    name={editInputNameArray[index]}
                    value={editInputArray[index] || ''}
                    onChange={onChangeEditInput}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    onClick={() => clickEditableSwitch(index)}
                    variant="contained"
                    color={editInputArray[index] === originalData[index] ? 'secondary' : 'primary'}
                    sx={{ color: '#FFFFFF' }}
                  >
                    {editableSwitch[index] === false ? '수정' : '완료'}
                  </Button>
                </Grid>
              </Grid>
            );
          })}
          <Button
            onClick={saveData}
            disabled={isChange === false}
            fullWidth
            variant="contained"
            sx={{ color: '#FFFFFF', my: '10px' }}
          >
            저장
          </Button>
          <Button onClick={onReset} fullWidth variant="contained" color="secondary">
            취소
          </Button>
        </OutLinedBox>
      </Grid>
    </Grid>
  );
}
