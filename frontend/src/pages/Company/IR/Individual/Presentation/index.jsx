import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { url } from '../../../../../component/commonVariable';
import { changeDateDash } from '../../../../../component/commonFunction';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import DeleteModal from './DeleteModal';
import AddEditModal from './AddEditModal';

export default function Presentation({ update, refreshSwitch, setRefreshSwitch }) {
  // 기업 stockCode url
  const { searchStockCode } = useParams();

  // 프리젠테이션 데이터 관련
  const dataTable = ['보고일', '행사명', '제목', 'IR 자료'];
  const [presentationData, setPresentationData] = useState([]);

  // 삭제, 추가 버튼
  const [deleteModalSwitch, setDeleteModalSwitch] = useState(false);
  const [addModalSwitch, setAddModalSwitch] = useState(false);

  // 프리젠테이션 데이터를 받아오는 Hook
  useEffect(() => {
    if (searchStockCode !== 'main') {
      axios
        .get(`${url}/admin/company/ir/individual/getData/search/presentation/${searchStockCode}`)
        .then(result => {
          // console.log(result.data);
          setPresentationData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchStockCode, refreshSwitch]);

  const openDeleteModal = () => {
    setDeleteModalSwitch(true);
  };

  const openAddEditModal = () => {
    setAddModalSwitch(true);
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: '30px' }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontSize={18} fontWeight={600}>
            프리젠테이션
          </Typography>
          <Typography>최근 업데이트 : {update}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={openDeleteModal}
            disabled={searchStockCode === 'main'}
            sx={{ minWidth: '90px' }}
          >
            삭제
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={openAddEditModal}
            disabled={searchStockCode === 'main'}
            sx={{ minWidth: '90px' }}
          >
            수정/추가
          </Button>
        </Stack>
      </Grid>

      {/* presentation 데이터 영역 */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: { md: '400px', xl: '650px' }, mt: '10px' }}
      >
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
            {presentationData.map(eachdata => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ minWidth: 70, maxWidth: 70 }}
                >
                  {changeDateDash(eachdata.published_date)}
                </StyledTableCell>
                <StyledTableCell align="center">{eachdata.conference_name}</StyledTableCell>
                <StyledTableCell align="center">{eachdata.title}</StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 70, maxWidth: 70 }}>
                  {presentationButton(eachdata.file_name, searchStockCode)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {deleteModalSwitch === true ? (
        <DeleteModal
          deleteModalSwtich={deleteModalSwitch}
          setDeleteModalSwitch={setDeleteModalSwitch}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
        />
      ) : null}

      {addModalSwitch === true ? (
        <AddEditModal
          addModalSwtich={addModalSwitch}
          setAddModalSwitch={setAddModalSwitch}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
        />
      ) : null}
    </div>
  );
}

function presentationButton(fileName, searchStockCode) {
  let answer;
  const openReport = () => {
    window.open(
      `https://api.butler.works/api/v1/ir-materials/downloads/presentations/${fileName}?stock_code=${searchStockCode}`,
    );
  };
  if (fileName) {
    answer = (
      <Button variant="outlined" color="secondary" sx={{ py: 0 }} onClick={openReport}>
        자료 보기
      </Button>
    );
  } else {
    answer = fileName;
  }
  return answer;
}

Presentation.defaultProps = {
  update: '-',
  refreshSwitch: true,
  setRefreshSwitch: () => {},
};

Presentation.propTypes = {
  update: PropTypes.string,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
};
