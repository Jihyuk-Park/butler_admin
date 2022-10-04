import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useInView } from 'react-intersection-observer';
import 'moment/locale/ko';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Grid,
} from '@mui/material';
import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';
import CustomModal from '../../component/UI/CustomModal';
import { itemNumber, url } from '../../component/constVariable';
import DropDown from '../../component/UI/DropDown';

export default function UserMemo() {
  // 데이터 정렬 기준 선택
  const sortFieldList = ['순번', '작성일', '갱신일', '기업명', '유저 닉네임'];
  const [sortField, setSortField] = useState('순번');
  const [sortType, setSortType] = useState('내림차순');

  // 메모 데이터 관련
  const dataTable = ['순번', '작성일', '갱신일', '기업명', '유저 닉네임', '타입', '메모', '삭제'];
  const [memoData, setMemoData] = useState([]);

  // 무한 스크롤 (ref가 화면에 나타나면 inView는 true, 아니면 false를 반환)
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(100);

  // 삭제 모달 스위치 및 삭제 ID 트래킹
  const [deleteModal, setDeleteModal] = useState(false);
  const [memoId, setMemoId] = useState(0);

  // 정렬 기준에 따라 메모를 받아오는 Hook
  useEffect(() => {
    axios
      .get(`${url}/admin/user/userMemo/getData/all/${page}/${sortField}/${sortType}`)
      .then(result => {
        // console.log(result.data);
        setMemoData([...memoData, ...result.data]);
        setLoading(false);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [page, sortField, sortType]);

  // 전체 페이지 수 계산을 위한 Hook (무한 스크롤)
  useEffect(() => {
    axios
      .get(`${url}/admin/user/userMemo/getTotalNum/all`)
      .then(result => {
        // console.log(result.data);
        setMaxPage(Math.ceil(result.data.totalnum / itemNumber));
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, []);

  // 무한 스크롤 훅 (하단 도달 시 페이지 갱신(+1))
  useEffect(() => {
    if (inView && !loading && page < maxPage && memoData.length !== 0) {
      setLoading(true);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  }, [inView, loading]);

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
    axios.post(`${process.env.REACT_APP_APIURL}/admin/user/userMemo/delete/${memoId}`).then(() => {
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
            {memoData.map(eachdata => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell align="center">{eachdata.id}</StyledTableCell>
                <StyledTableCell align="center">{changeDate(eachdata.created_at)}</StyledTableCell>
                <StyledTableCell align="center">{changeDate(eachdata.updated_at)}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.corp_name}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.NickName}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.type}</StyledTableCell>
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
      <Box ref={ref} sx={{ height: '10px', mt: '30px' }} />

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

function changeDate(date) {
  const publishDate = moment(date).format('YYYY.MM.DD');
  return publishDate;
}
