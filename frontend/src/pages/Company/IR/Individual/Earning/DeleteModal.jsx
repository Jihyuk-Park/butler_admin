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
import CustomModal from '../../../../../component/UI/CustomModal';


// 11.16 피드백 편집 모달로 합병
// 따로 사용 시, modalSwitch를 통해 컨트롤
export default function DeleteModal({
  deleteModalSwtich,
  setDeleteModalSwitch,
  refreshSwitch,
  setRefreshSwitch,
}) {
  const { searchStockCode } = useParams();

  // 실적발표 데이터
  const earningTable = ['사업 연도', '분기', '파일명', '삭제'];
  const [earningData, setEarningData] = useState([]);

  // 선택 자료 삭제 확인 모달 및 선택한 자료
  const [confirmSelectModalSwitch, setConfirmSelectModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  // 전채 자료 삭제 확인 모달
  const [confirmAllModalSwitch, setConfirmAllModalSwitch] = useState(false);

  useEffect(() => {
    if (searchStockCode !== 'main') {
      axios
        .get(`${url}/admin/company/ir/individual/getData/search/earningList/${searchStockCode}`)
        .then(result => {
          // console.log(result.data);
          setEarningData(result.data);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [refreshSwitch]);

  const openDeleteSelectConfirm = each => {
    setSelectedData(each);
    setConfirmSelectModalSwitch(true);
  };

  const deleteSelectedData = () => {
    // console.log(selectedData);
    const body = { ...selectedData };

    axios.post(`${url}/admin/company/ir/individual/delete/earning/select`, body).then(() => {
      alert('삭제가 완료되었습니다');
      setRefreshSwitch(!refreshSwitch);
      setConfirmSelectModalSwitch(false);
    });
  };

  const openDeleteAllConfirm = () => {
    setConfirmAllModalSwitch(true);
  };

  const deleteAllData = () => {
    const body = [...earningData];
    console.log(body);

    axios.post(`${url}/admin/company/ir/individual/delete/earning/all`, body).then(() => {
      alert('삭제가 완료되었습니다');
      setConfirmAllModalSwitch(false);
      setRefreshSwitch(!refreshSwitch);
    });
  };

  const modalClose = () => {
    setDeleteModalSwitch(false);
    setRefreshSwitch(!refreshSwitch);
  };

  return (
    <div>
      <Modal open={deleteModalSwtich} onClose={modalClose}>
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
                    <StyledTableCell sx={{ minWidth: 40, maxWidth: 40 }}>
                      {eachdata.bsns_year}
                    </StyledTableCell>
                    <StyledTableCell>{eachdata.quarter_id}</StyledTableCell>
                    <StyledTableCell>{eachdata.file_name}</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
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
            <Button
              variant="contained"
              onClick={openDeleteAllConfirm}
              sx={{ color: 'white', mr: '10px' }}
            >
              전체 삭제
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>

      {confirmSelectModalSwitch === false ? null : (
        <CustomModal
          message={`${selectedData.bsns_year}년 ${selectedData.quarter_id}분기 실적발표 자료를\n삭제하시겠습니까?`}
          customModalSwitch={confirmSelectModalSwitch}
          setCustomModalSwitch={setConfirmSelectModalSwitch}
          customFunction={deleteSelectedData}
        />
      )}

      {confirmAllModalSwitch === false ? null : (
        <CustomModal
          message={`${earningData[0].corp_name}의 모든 실적발표 자료를\n삭제하시겠습니까?`}
          customModalSwitch={confirmAllModalSwitch}
          setCustomModalSwitch={setConfirmAllModalSwitch}
          customFunction={deleteAllData}
        />
      )}
    </div>
  );
}

DeleteModal.defaultProps = {
  deleteModalSwtich: true,
  setDeleteModalSwitch: () => {},
  refreshSwitch: true,
  setRefreshSwitch: () => {},
};

DeleteModal.propTypes = {
  deleteModalSwtich: PropTypes.bool,
  setDeleteModalSwitch: PropTypes.func,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
};
