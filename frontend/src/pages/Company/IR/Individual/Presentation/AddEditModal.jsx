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
import AddMutlipleFile from './AddMutlipleFile';
import CustomModal from '../../../../../component/UI/CustomModal';

export default function AddEditModal({
  addModalSwtich,
  setAddModalSwitch,
  refreshSwitch,
  setRefreshSwitch,
}) {
  const { searchStockCode } = useParams();

  // 실적발표 데이터
  const presentationTable = ['날짜', '행사명', '제목', '파일명', '삭제'];
  const [presentationData, setPresentationData] = useState([]);

  // 선택 자료 수정 모달 및 선택 자료
  const [isEditModal, setIsEditModal] = useState(true);
  const [addEditModalSwitch, setAddEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  // 파일 다중 추가
  const [addMutlipleModalSwitch, setAddMutlipleModalSwitch] = useState(false);

  // 선택 자료 삭제 확인 모달
  const [confirmSelectModalSwitch, setConfirmSelectModalSwitch] = useState(false);

  // 전채 자료 삭제 확인 모달
  const [confirmAllModalSwitch, setConfirmAllModalSwitch] = useState(false);

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
  }, [refreshSwitch]);

  const openDeleteSelectConfirm = each => {
    setSelectedData(each);
    setConfirmSelectModalSwitch(true);
  };

  const deleteSelectedData = () => {
    const body = { ...selectedData };
    // console.log(body);

    axios.post(`${url}/admin/company/ir/individual/delete/presentation/select`, body).then(() => {
      alert('삭제가 완료되었습니다');
      setConfirmSelectModalSwitch(false);
      setRefreshSwitch(!refreshSwitch);
    });
  };

  const openDeleteAllConfirm = () => {
    setConfirmAllModalSwitch(true);
  };

  const deleteAllData = () => {
    const body = [...presentationData];

    axios.post(`${url}/admin/company/ir/individual/delete/presentation/all`, body).then(() => {
      alert('삭제가 완료되었습니다');
      setConfirmAllModalSwitch(false);
      setRefreshSwitch(!refreshSwitch);
    });
  };

  const addNewData = () => {
    setIsEditModal(false);
    setAddEditModalSwitch(true);
  };

  const addMultipleFile = () => {
    setAddMutlipleModalSwitch(true);
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
                    return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {presentationData.map(eachdata => (
                  <StyledTableRow key={eachdata.id}>
                    <StyledTableCell>{changeDateDot(eachdata.published_date)}</StyledTableCell>
                    <StyledTableCell>{eachdata.conference_name}</StyledTableCell>
                    <StyledTableCell>{eachdata.title}</StyledTableCell>
                    <StyledTableCell>{eachdata.file_name}</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                      <Button
                        onClick={() => {
                          openDeleteSelectConfirm(eachdata);
                        }}
                        sx={{ py: 0 }}
                      >
                        삭제
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" onClick={addNewData} sx={{ color: 'white', mr: '10px' }}>
              파일 개별 추가
            </Button>
            <Button
              variant="contained"
              onClick={addMultipleFile}
              sx={{ color: 'white', mr: '10px' }}
            >
              파일 다중 추가
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
            <Button
              variant="contained"
              color="red"
              onClick={openDeleteAllConfirm}
              sx={{ color: '#FFF', ml: '10px' }}
            >
              전체 삭제
            </Button>
          </Box>
        </Box>
      </Modal>

      {addEditModalSwitch === false ? null : (
        <AddEditInputModal
          editData={selectedData}
          addEditModalSwitch={addEditModalSwitch}
          setAddEditModalSwitch={setAddEditModalSwitch}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          isEditModal={isEditModal}
          presentationData={presentationData}
        />
      )}

      {addMutlipleModalSwitch === false ? null : (
        <AddMutlipleFile
          addMutlipleModalSwitch={addMutlipleModalSwitch}
          setAddMutlipleModalSwitch={setAddMutlipleModalSwitch}
          presentationData={presentationData}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
        />
      )}

      {confirmSelectModalSwitch === false ? null : (
        <CustomModal
          message={`${changeDateDot(
            selectedData.published_date,
          )} 프리젠테이션 자료를\n삭제하시겠습니까?`}
          customModalSwitch={confirmSelectModalSwitch}
          setCustomModalSwitch={setConfirmSelectModalSwitch}
          customFunction={deleteSelectedData}
        />
      )}

      {confirmAllModalSwitch === false ? null : (
        <CustomModal
          message={`${presentationData[0].corp_name}의 모든 프리젠테이션 자료를\n삭제하시겠습니까?`}
          customModalSwitch={confirmAllModalSwitch}
          setCustomModalSwitch={setConfirmAllModalSwitch}
          customFunction={deleteAllData}
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
