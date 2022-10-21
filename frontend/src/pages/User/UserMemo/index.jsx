import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import CustomModal from '../../../component/UI/CustomModal';
import { url } from '../../../component/commonVariable';
import { changeDateDot } from '../../../component/commonFunction';
import DropDown from '../../../component/UI/DropDown';
import Pagination from '../../../component/Pagination/index';

export default function UserMemo() {
  // 데이터 정렬 기준 선택
  const sortFieldList = ['순번', '작성일', '갱신일', '기업명', '유저 닉네임'];
  const [sortField, setSortField] = useState('순번');
  const [sortType, setSortType] = useState('내림차순');

  // 메모 데이터 관련
  const dataTable = ['순번', '작성일', '갱신일', '기업명', '유저 닉네임', '타입', '메모', '삭제'];
  const [memoData, setMemoData] = useState([]);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(100);

  // 삭제 모달 스위치 및 삭제 ID 트래킹
  const [deleteModal, setDeleteModal] = useState(false);
  const [memoId, setMemoId] = useState(0);

  // 정렬 기준에 따라 메모를 받아오는 Hook
  useEffect(() => {
    axios
      .get(`${url}/admin/user/userMemo/getData/all/${page}/${sortField}/${sortType}`)
      .then(result => {
        // console.log(result.data);
        setMemoData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [page, sortField, sortType]);

  // 전체 페이지 수 계산을 위한 Hook
  useEffect(() => {
    axios
      .get(`${url}/admin/user/userMemo/getTotalNum/all`)
      .then(result => {
        // console.log(result.data.totalnum);
        setTotalItem(result.data.totalnum);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, []);

  // 데이터 정렬 타입 선택
  const selectField = e => {
    setMemoData([]);
    setPage(1);
    setSortField(e.target.value);
  };

  // 내림/오름차순 선택
  const selectSortType = () => {
    setMemoData([]);
    setPage(1);
    if (sortType === '내림차순') {
      setSortType('오름차순');
    } else {
      setSortType('내림차순');
    }
  };

  // 삭제 버튼 (모달 창 열기)
  const openDeleteModal = id => {
    setDeleteModal(true);
    setMemoId(id);
  };

  // 삭제 확인 시, 데이터 삭제
  const deleteMemo = () => {
    axios.post(`${url}/admin/user/userMemo/delete/${memoId}`).then(() => {
      setDeleteModal(false);
      memoData.map((eachdata, index) => {
        if (eachdata.id === memoId) {
          memoData.splice(index, 1);
        }
        return eachdata;
      });
    });
  };

  return (
    <div>
      {/* 정렬 영역  */}
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        <DropDown
          value={sortField}
          label="정렬 타입"
          onChange={selectField}
          selectList={sortFieldList}
        />
        <Button
          onClick={selectSortType}
          color={sortType === '내림차순' ? 'primary' : 'inactive'}
          sx={{ ml: '15px' }}
        >
          내림차순
        </Button>
        <Button onClick={selectSortType} color={sortType === '오름차순' ? 'primary' : 'inactive'}>
          오름차순
        </Button>
      </Grid>

      {/* 메모 데이터 영역 */}
      <TableContainer component={Paper} sx={{ maxHeight: { md: '545px', xl: '885px' } }}>
        <Table stickyHeader>
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
            {memoData.map(eachdata => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                <StyledTableCell align="center">
                  {changeDateDot(eachdata.created_at)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {changeDateDot(eachdata.updated_at)}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 90, maxWidth: 90 }}>
                  {eachdata.corp_name}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 90, maxWidth: 90 }}>
                  {eachdata.NickName}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ minWidth: 100, maxWidth: 100, wordBreak: 'break-all' }}
                >
                  {eachdata.type}
                </StyledTableCell>
                <StyledTableCell align="center">{eachdata.memo}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    onClick={() => openDeleteModal(eachdata.id)}
                    variant="contained"
                    color="secondary"
                  >
                    삭제
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination page={page} totalItem={totalItem} setPage={setPage} />

      {/* 삭제 모달 영역 */}
      {deleteModal === false ? null : (
        <CustomModal
          customFunction={deleteMemo}
          customModalSwitch={deleteModal}
          setCustomModalSwitch={setDeleteModal}
          message="정말로 삭제하시겠습니까?"
        />
      )}
    </div>
  );
}
