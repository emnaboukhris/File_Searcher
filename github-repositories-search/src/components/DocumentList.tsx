import React, { useEffect, useState } from 'react';
import { Document } from '../models/models';
import { Divider } from '@mui/material';
import ReactPaginate from 'react-paginate';
import DocumentItem from './DocumentItem';

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(0);

  // handle current page on filter
  useEffect(() => {
    setCurrentPage(0);
  }, [documents]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * itemsPerPage;
  const paginatedDocuments = documents.slice(offset, offset + itemsPerPage);

  return (
    <div>
      {/* Mapping and Rendering Document Items */}
      {paginatedDocuments.map((document, id) => (
        <div key={id}>
          <DocumentItem document={document} />
          <Divider />
        </div>
      ))}

      {/* Pagination Component */}
      <ReactPaginate
        pageCount={Math.ceil(documents.length / itemsPerPage)}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={({ selected }) => handlePageChange(selected)}
        forcePage={currentPage}
        containerClassName="pagination"
        disabledClassName={'pagination__link--disabled'}
        activeClassName={'pagination__link--active'}
      />
    </div>
  );
};

export default DocumentList;
