import React from 'react';
import Pagination from 'react-js-pagination';
import PropTypes from 'prop-types';
import './Pagenation.css';

export default function Pagenation({ page, totalItem, setPage, itemNumber }) {
  return (
    <div>
      현재 : {page}, 전체 : {totalItem}, 아이템 개수 : {itemNumber}, 전체 페이지 :
      {Math.ceil(totalItem / itemNumber)}
      <Pagination
        activePage={page}
        itemsCountPerPage={itemNumber}
        totalItemsCount={totalItem}
        hideFirstLastPages
        pageRangeDisplayed={5}
        prevPageText="‹"
        nextPageText="›"
        onChange={setPage}
      />
    </div>
  );
}

Pagenation.defaultProps = {
  page: 1,
  totalItem: 100,
  setPage: () => {},
  itemNumber: 12,
};

Pagenation.propTypes = {
  page: PropTypes.number,
  totalItem: PropTypes.number,
  setPage: PropTypes.func,
  itemNumber: PropTypes.number,
};
