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
import { url } from '../../../../../../component/commonVariable';
import StyledTableCell from '../../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../../component/UI/StyledTableRow';
import AddEditInputGeographyModal from './AddEditInputGeographyModal';
import CustomModal from '../../../../../../component/UI/CustomModal';

export default function EditGeographyModal({
  editModalSwitch,
  setEditModalSwitch,
  refreshSwitch,
  setRefreshSwitch,
}) {
  const { searchCorpCode } = useParams();

  // 실적발표 데이터
  const dataTable = ['지역정보', '지역1', '지역2', '지역3', '주요지역', '지역설명', '변경', '삭제'];
  const [geographyInfoData, setGeographyInfoData] = useState([]);

  // 선택 자료 수정 모달 및 선택 자료
  const [isEditModal, setIsEditModal] = useState(true);
  const [addEditModalSwitch, setAddEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  // 삭제 모달
  const [deleteConfirmModalSwitch, setDeleteConfirmModalSwitch] = useState(false);

  // 수정 / 추가 후 데이터 갱신
  const [refreshSwitch2Depth, setRefreshSwitch2Depth] = useState(true);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/geography/individual/info/geography/getData/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          setGeographyInfoData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [refreshSwitch2Depth]);

  const editSelectData = each => {
    setSelectedData(each);
    setIsEditModal(true);
    setAddEditModalSwitch(true);
  };

  // 삭제 확인 모달을 여는 함수
  const openDeleteModal = data => {
    setSelectedData(data);
    setDeleteConfirmModalSwitch(true);
  };

  // 삭제 함수
  const deleteData = () => {
    const body = { ...selectedData };
    axios
      .post(
        `${url}/admin/company/geography/individual/info/geography/delete/${searchCorpCode}`,
        body,
      )
      .then(() => {
        alert('삭제가 완료되었습니다.');
        setDeleteConfirmModalSwitch(false);
        setRefreshSwitch2Depth(!refreshSwitch2Depth);
      })
      .catch(() => {
        console.log('실패했습니다');
      });
  };

  const addNewData = () => {
    setIsEditModal(false);
    setAddEditModalSwitch(true);
  };

  const modalClose = () => {
    setEditModalSwitch(false);
    setRefreshSwitch(!refreshSwitch);
  };

  return (
    <div>
      <Modal open={editModalSwitch} onClose={modalClose}>
        <Box
          sx={{
            width: 960,
            height: { lg: 550, xl: 650 },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'scroll',
            bgcolor: '#F8F8F8',
            border: '1px solid #B8B8B8;',
            borderRadius: '4px',
            p: '40px 60px 40px 60px',
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
            <Box sx={{ mb: '30px' }}>지역정보</Box>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ mb: '30px', maxHeight: { md: '400px', xl: '500px' } }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {dataTable.map(function (eachdata) {
                    return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {geographyInfoData.map((eachdata, index) => (
                  <StyledTableRow key={eachdata.id}>
                    <StyledTableCell sx={{ minWidth: 30, maxWidth: 30 }}>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                      {eachdata.depth1}
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                      {eachdata.depth2}
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                      {eachdata.depth3}
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 30, maxWidth: 30 }}>
                      {eachdata.is_importance}
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                      {eachdata.description}
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                      <Button
                        onClick={() => {
                          editSelectData(eachdata);
                        }}
                        sx={{ py: 0 }}
                      >
                        변경
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                      <Button
                        sx={{ py: 0 }}
                        onClick={() => {
                          openDeleteModal(eachdata);
                        }}
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
              추가하기
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>

      {deleteConfirmModalSwitch === false ? null : (
        <CustomModal
          // eslint-disable-next-line
          message={`부문1 : ${selectedData.depth1}${selectedData.depth2 && `\n부문2 : ${selectedData.depth2}`}${selectedData.depth3 && `\n부문3 : ${selectedData.depth3}`}\n의 데이터를 ${selectedData.depth2 === '' || selectedData.depth3 === '' ? '전부 ' : ''}삭제하시겠습니까?`}
          customModalSwitch={deleteConfirmModalSwitch}
          setCustomModalSwitch={setDeleteConfirmModalSwitch}
          customFunction={deleteData}
        />
      )}

      {addEditModalSwitch === false ? null : (
        <AddEditInputGeographyModal
          editData={selectedData}
          geographyInfoData={geographyInfoData}
          addEditModalSwitch={addEditModalSwitch}
          setAddEditModalSwitch={setAddEditModalSwitch}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          isEditModal={isEditModal}
          refreshSwitch2Depth={refreshSwitch2Depth}
          setRefreshSwitch2Depth={setRefreshSwitch2Depth}
        />
      )}
    </div>
  );
}

EditGeographyModal.defaultProps = {
  editModalSwitch: true,
  setEditModalSwitch: () => {},
  refreshSwitch: true,
  setRefreshSwitch: () => {},
};

EditGeographyModal.propTypes = {
  editModalSwitch: PropTypes.bool,
  setEditModalSwitch: PropTypes.func,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
};
