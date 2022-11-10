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
} from '@mui/material';
import StyledTableCell from '../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../component/UI/StyledTableRow';
import CustomModal from '../../../component/UI/CustomModal';
import { url } from '../../../component/commonVariable';
import { changeDateDot } from '../../../component/commonFunction';
import Pagination from '../../../component/Pagination/index';

export default function UserMemo() {
  // 데이터 정렬 기준 선택
  const [sortField, setSortField] = useState('순번');
  const [sortType, setSortType] = useState('▼');

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

  // 정렬
  const sortData = field => {
    if (field !== '삭제') {
      if (sortField !== field) {
        setSortField(field);
      } else if (sortField === field) {
        if (sortType === '▼') {
          setSortType('▲');
        } else {
          setSortField('순번');
          setSortType('▼');
        }
      }
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
      {/* 메모 데이터 영역 */}
      <TableContainer component={Paper} sx={{ maxHeight: { md: '605px', xl: '950px' } }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {dataTable.map(function (eachdata) {
                return (
                  <StyledTableCell
                    key={eachdata}
                    onClick={() => {
                      sortData(eachdata);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {eachdata} {sortField === eachdata ? sortType : null}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {memoData.map(eachdata => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell sx={{ minWidth: 50, maxWidth: 50 }}>{eachdata.id}</StyledTableCell>
                <StyledTableCell>{changeDateDot(eachdata.created_at)}</StyledTableCell>
                <StyledTableCell>{changeDateDot(eachdata.updated_at)}</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 90, maxWidth: 90 }}>
                  {eachdata.corp_name}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 90, maxWidth: 90 }}>
                  {eachdata.NickName}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 100, maxWidth: 100, wordBreak: 'break-all' }}>
                  {eachdata.type}
                </StyledTableCell>
                <StyledTableCell>{eachdata.memo}</StyledTableCell>
                <StyledTableCell>
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

      {/* 페이지네이션 */}
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
