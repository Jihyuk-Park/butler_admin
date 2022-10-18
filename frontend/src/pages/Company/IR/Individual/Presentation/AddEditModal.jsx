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
import { changeDateDot } from '../../../../../component/commonFunction';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import AddEditInputModal from './AddEditInputModal';

export default function AddEditModal({ addModalSwtich, setAddModalSwitch }) {
  const { searchStockCode } = useParams();

  // 실적발표 데이터
  const presentationTable = ['날짜', '행사명', '제목', '파일명', '삭제'];
  const [presentationData, setPresentationData] = useState([]);

  // 선택 자료 수정 모달 및 선택 자료
  const [isEditModal, setIsEditModal] = useState(true);
  const [addEditModalSwitch, setAddEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  // 수정 / 추가 후 데이터 갱신
  const [refreshSwtich, setRefreshSwtich] = useState(true);

  useEffect(() => {
    axios
      .get(`${url}/admin/company/ir/individual/getData/search/presentationList/${searchStockCode}`)
      .then(result => {
        // console.log(result.data);
        setPresentationData(result.data);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  }, [refreshSwtich]);

  const editSelectData = each => {
    setSelectedData(each);
    setIsEditModal(true);
    setAddEditModalSwitch(true);
  };

  const addNewData = () => {
    setIsEditModal(false);
    setAddEditModalSwitch(true);
  };

  const modalClose = () => setAddModalSwitch(false);

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
              {presentationData.length !== 0 ? presentationData[0].corp_name : null} 프리젠테이션
              편집
            </Box>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ mb: '30px', maxHeight: { md: '400px', xl: '500px' } }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {presentationTable.map(function (eachdata) {
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
                    <StyledTableCell align="center" component="th" scope="row">
                      {changeDateDot(eachdata.published_date)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{eachdata.conference_name}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.title}</StyledTableCell>
                    <StyledTableCell align="center">{eachdata.file_name}</StyledTableCell>
                    <StyledTableCell align="center" sx={{ minWidth: 60, maxWidth: 60 }}>
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
          refreshSwtich={refreshSwtich}
          setRefreshSwtich={setRefreshSwtich}
          isEditModal={isEditModal}
          presentationData={presentationData}
        />
      )}
    </div>
  );
}

AddEditModal.defaultProps = {
  addModalSwtich: true,
  setAddModalSwitch: () => {},
};

AddEditModal.propTypes = {
  addModalSwtich: PropTypes.bool,
  setAddModalSwitch: PropTypes.func,
};
