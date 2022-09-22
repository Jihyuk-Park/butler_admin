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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from '@mui/material';
import StyledTableCell from '../../component/UI/StyledTableCell';
import StyledTableRow from '../../component/UI/StyledTableRow';
import CustomModal from '../../component/UI/CustomModal';

export default function UserMemo() {
  const dataTable = ['순번', '작성일', '갱신일', '기업명', '유저 닉네임', '타입', '메모', '삭제'];
  const [sortField, setSortField] = useState('순번');
  const [sortType, setSortType] = useState('내림차순');
  const sortFieldList = ['순번', '작성일', '갱신일', '기업명', '유저 닉네임'];
  const [memoData, setMemoData] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(100);
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [memoId, setMemoId] = useState(0);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_APIURL}/admin/user/userMemo/getData/all/${page}/${sortField}/${sortType}`,
      )
      .then(result => {
        // console.log(result.data);
        setMemoData([...memoData, ...result.data]);
        setLoading(false);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [page, sortField, sortType]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_APIURL}/admin/user/userMemo/getTotalNum/all`)
      .then(result => {
        // console.log(result.data);
        setMaxPage(Math.ceil(result.data.totalnum / 12));
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, []);

  useEffect(() => {
    if (inView && !loading && page <= maxPage && memoData.length !== 0) {
      setLoading(true);
      if (page < maxPage) {
        setPage(page + 1);
      }
    }
  }, [inView, loading]);

  const openDeleteModal = id => {
    setDeleteModal(true);
    setMemoId(id);
  };

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

  const selectField = e => {
    setMemoData([]);
    setPage(1);
    setSortField(e.target.value);
  };

  const selectSortType = () => {
    setMemoData([]);
    setPage(1);
    if (sortType === '내림차순') {
      setSortType('오름차순');
    } else {
      setSortType('내림차순');
    }
  };

  return (
    <div>
      <Grid container alignItems="flex-start" sx={{ mb: '20px' }}>
        <FormControl sx={{ mr: '15px' }}>
          <InputLabel>정렬 타입</InputLabel>
          <Select value={sortField} label="정렬 타입" onChange={selectField}>
            {sortFieldList.map(function (eachdata) {
              return (
                <MenuItem key={eachdata} value={eachdata}>
                  {eachdata}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button onClick={selectSortType} color={sortType === '내림차순' ? 'primary' : 'inactive'}>
          내림차순
        </Button>
        <Button onClick={selectSortType} color={sortType === '오름차순' ? 'primary' : 'inactive'}>
          오름차순
        </Button>
      </Grid>
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
