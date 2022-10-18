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
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import DeleteModal from './DeleteModal';
import AddEditModal from './AddEditModal';

export default function Earning({ update }) {
  // 기업 stockCode url
  const { searchStockCode } = useParams();

  // 실적 데이터 관련
  const dataTable = ['연도', '1분기', '2분기', '3분기', '4분기'];
  const [earningData, setEarningData] = useState([]);

  // 삭제, 추가 버튼
  const [deleteModalSwitch, setDeleteModalSwitch] = useState(false);
  const [addModalSwitch, setAddModalSwitch] = useState(false);

  // 실적 데이터를 받아오는 Hook
  useEffect(() => {
    if (searchStockCode !== 'main') {
      axios
        .get(`${url}/admin/company/ir/individual/getData/search/earning/${searchStockCode}`)
        .then(result => {
          // console.log(result.data);
          setEarningData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchStockCode]);

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
        sx={{ mt: '10px' }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontSize={18} fontWeight={600}>
            실적 발표
          </Typography>
          <Typography>최근 업데이트 : {update}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={openDeleteModal}
            sx={{ minWidth: '90px' }}
          >
            삭제
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={openAddEditModal}
            sx={{ minWidth: '90px' }}
          >
            수정/추가
          </Button>
        </Stack>
      </Grid>

      {/* earning 데이터 영역 */}
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
            {earningData.map(eachdata => (
              <StyledTableRow key={eachdata.bsns_year}>
                <StyledTableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ minWidth: 70, maxWidth: 70 }}
                >
                  {eachdata.bsns_year}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {earningButton(eachdata.Q1, eachdata.bsns_year, 1, searchStockCode)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {earningButton(eachdata.Q2, eachdata.bsns_year, 2, searchStockCode)}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 70, maxWidth: 70 }}>
                  {earningButton(eachdata.Q3, eachdata.bsns_year, 3, searchStockCode)}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: 70, maxWidth: 70 }}>
                  {earningButton(eachdata.Q4, eachdata.bsns_year, 4, searchStockCode)}
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
        />
      ) : null}
      {addModalSwitch === true ? (
        <AddEditModal addModalSwtich={addModalSwitch} setAddModalSwitch={setAddModalSwitch} />
      ) : null}
    </div>
  );
}

function earningButton(fileName, year, quarter, searchStockCode) {
  let answer;
  const openReport = () => {
    window.open(
      `https://api.butler.works/api/v1/ir-materials/downloads/earnings/${fileName}?bsns_year=${year}&quarter_id=${quarter}&stock_code=${searchStockCode}`,
    );
  };

  if (fileName) {
    answer = (
      <Button variant="outlined" color="secondary" onClick={openReport} sx={{ py: 0 }}>
        실적발표
      </Button>
    );
  } else {
    answer = fileName;
  }
  return answer;
}

Earning.defaultProps = {
  update: '-',
};

Earning.propTypes = {
  update: PropTypes.string,
};
