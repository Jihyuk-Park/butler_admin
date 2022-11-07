import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
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
import AddEditInputModal from './AddEditInputModal';

export default function AddEditModal({
  addModalSwtich,
  setAddModalSwitch,
  refreshSwitch,
  setRefreshSwitch,
}) {
  const { searchStockCode } = useParams();

  // 실적발표 데이터
  const earningTable = ['파일 목록', '사업 연도', '분기', '수정'];
  const [earningData, setEarningData] = useState([]);

  // 선택 자료 수정 모달 및 선택 자료
  const [isEditModal, setIsEditModal] = useState(true);
  const [addEditModalSwitch, setAddEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  // 수정 / 추가 후 데이터 갱신
  const [refreshSwitch2Depth, setRefreshSwitch2Depth] = useState(true);

  useEffect(() => {
    axios
      .get(`${url}/admin/company/ir/individual/getData/search/earningList/${searchStockCode}`)
      .then(result => {
        // console.log(result.data);
        setEarningData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [refreshSwitch2Depth]);

  const editSelectData = each => {
    setSelectedData(each);
    setIsEditModal(true);
    setAddEditModalSwitch(true);
  };

  const addNewData = () => {
    setIsEditModal(false);
    setAddEditModalSwitch(true);
  };

  const modalClose = () => {
    setAddModalSwitch(false);
    setRefreshSwitch(!refreshSwitch);
  };

  return (
    <div>
      <Modal open={addModalSwtich} onClose={modalClose}>
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
            <Box sx={{ mb: '30px' }}>
              {earningData.length !== 0 ? earningData[0].corp_name : null} 실적발표 편집
            </Box>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ mb: '30px', maxHeight: { md: '400px', xl: '500px' } }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {earningTable.map(function (eachdata) {
                    return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {earningData.map(eachdata => (
                  <StyledTableRow key={eachdata.id}>
                    <StyledTableCell>{eachdata.file_name}</StyledTableCell>
                    <StyledTableCell>{eachdata.bsns_year}</StyledTableCell>
                    <StyledTableCell>{eachdata.quarter_id}</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                      <Button
                        onClick={() => {
                          editSelectData(eachdata);
                        }}
                        sx={{ py: 0 }}
                      >
                        수정
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" onClick={addNewData} sx={{ color: 'white', mr: '10px' }}>
              추가하기
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>

      {addEditModalSwitch === false ? null : (
        <AddEditInputModal
          editData={selectedData}
          addEditModalSwitch={addEditModalSwitch}
          setAddEditModalSwitch={setAddEditModalSwitch}
          refreshSwitch={refreshSwitch2Depth}
          setRefreshSwitch={setRefreshSwitch2Depth}
          isEditModal={isEditModal}
          earningData={earningData}
        />
      )}
    </div>
  );
}

AddEditModal.defaultProps = {
  addModalSwtich: true,
  setAddModalSwitch: () => {},
  refreshSwitch: true,
  setRefreshSwitch: () => {},
};

AddEditModal.propTypes = {
  addModalSwtich: PropTypes.bool,
  setAddModalSwitch: PropTypes.func,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
};
