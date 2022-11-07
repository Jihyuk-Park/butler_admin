import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Typography,
} from '@mui/material';
import OutLinedBox from '../../../component/UI/OutLinedBox';
import FixedBox from '../../../component/UI/FixedBox';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import { url } from '../../../component/commonVariable';
import DropDown from '../../../component/UI/DropDown';
import Pagination from '../../../component/Pagination/index';

export default function UserInfo() {
  // 유저 정보 데이터 관련
  const dataTable = ['닉네임', '이름', '전화번호', '이메일', '로그인 방식', 'Grade', 'Type', 'Uid'];
  const [userInfoData, setUserInfoData] = useState([]);

  // 검색 관련
  const searchTypeList = ['닉네임', '이름', '로그인 방식', 'Grade', 'Type', 'Uid'];
  const [searchType, setSearchType] = useState('닉네임');
  const [searchInput, setSearchInput] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(true);

  const [isInputType, setIsInputType] = useState(true);
  const [typeSelect, setTypeSelect] = useState([]);
  const loginList = ['KAKAO', 'NAVER'];
  const gradeList = ['CANCEL', 'PROGRESS', 'EXPIRED'];
  const typeList = ['SIGNUP', 'MONTH', 'HARF_YEAR', 'YEAR'];

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

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(100);

  // 유저 정보 데이터를 받아오는 Hook
  // 검색 유무에 따라 전체 데이터 혹은 일치하는 데이터
  useEffect(() => {
    if (isSearch === false) {
      axios
        .get(`${url}/admin/user/userInfo/getData/all/${page}`)
        .then(result => {
          // console.log(result.data);
          setUserInfoData(result.data);
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
          setUserInfoData(result.data);
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
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    } else {
      axios
        .get(`${url}/admin/user/userInfo/getTotalNum/search/${searchType}/${searchInput}`)
        .then(result => {
          // console.log(result.data);
          setTotalItem(result.data.totalnum);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [isSearch, refreshSwitch]);

  // 검색 타입 설정
  const selectType = e => {
    const type = e.target.value;
    setSearchType(type);
    if (type === '로그인 방식') {
      setTypeSelect(loginList);
      setIsInputType(false);
    } else if (type === 'Grade') {
      setTypeSelect(gradeList);
      setIsInputType(false);
    } else if (type === 'Type') {
      setTypeSelect(typeList);
      setIsInputType(false);
    } else {
      setIsInputType(true);
      setSearchInput('');
    }
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
    setPage(1);
    setUserInfoData([]);
    setRefreshSwitch(!refreshSwitch);

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
      editGrade: each.status,
      editType: each.type,
      editUid: each.id,
    });
    setOriginalId(each.id);
    setOriginalData([
      each.NickName,
      each.Name,
      each.Phone,
      each.EMail,
      each.AuthType,
      each.status,
      each.type,
      each.id,
    ]);
    setEditableSwitch([false, false, false, false, false, false, false, false]);
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

    let differenceNum = 0;
    editInputArray.map(function (each, index) {
      // console.log(each, originalData[index]);
      if (each !== originalData[index]) {
        differenceNum += 1;
      }
      return null;
    });

    if (differenceNum === 0) {
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
            status: editGrade,
            type: editType,
            id: editUid,
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
    setEditableSwitch([false, false, false, false, false, false, false, false]);
    setOriginalData(['', '', '', '', '', '', '', '']);
    setIsChange(false);
  };

  return (
    <Grid container columnSpacing={1}>
      {/* userInfo 표 영역 */}
      <Grid item xs={8}>
        <TableContainer component={Paper} sx={{ maxHeight: { md: '610px', xl: '885px' } }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {dataTable.map(function (eachdata) {
                  return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {userInfoData.map(eachdata => (
                <StyledTableRow key={eachdata.id}>
                  <StyledTableCell>
                    <Button onClick={() => setEditData(eachdata)} color="secondary" sx={{ p: 0 }}>
                      {eachdata.NickName}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>{eachdata.Name}</StyledTableCell>
                  <StyledTableCell>{eachdata.Phone}</StyledTableCell>
                  <StyledTableCell>{eachdata.EMail}</StyledTableCell>
                  <StyledTableCell>{eachdata.AuthType}</StyledTableCell>
                  <StyledTableCell>{eachdata.status}</StyledTableCell>
                  <StyledTableCell>{eachdata.type}</StyledTableCell>
                  <StyledTableCell>{eachdata.id}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={4} sx={{ width: 10 / 36 }}>
        {/* 검색 창 부분 */}
        <FixedBox>
          <Stack direction="row" spacing={1} sx={{ mb: '10px' }}>
            <DropDown
              value={searchType}
              label="검색 타입"
              onChange={selectType}
              selectList={searchTypeList}
              p="10px 100px 10px 15px"
            />
            {isInputType === true ? (
              <TextField fullWidth value={searchInput} onChange={searchInputOnChange} />
            ) : (
              <DropDown
                value={searchInput}
                label="검색 타입"
                onChange={searchInputOnChange}
                selectList={typeSelect}
              />
            )}
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
                      color={
                        editInputArray[index] === originalData[index] ? 'secondary' : 'primary'
                      }
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
        </FixedBox>
      </Grid>
      <Grid item xs={12}>
        <Pagination page={page} totalItem={totalItem} setPage={setPage} />
      </Grid>
    </Grid>
  );
}
