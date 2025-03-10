import React, { useState } from "react";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(3); 

  // Function to update the range when the page changes
  const updatePageRange = (newPage) => {
    if (newPage === pageEnd && newPage < totalPages) {
      setPageStart(pageEnd + 1);
      setPageEnd(pageEnd + 3);
    } else if (newPage === pageStart && pageStart > 1) {
      
      setPageStart(pageStart - 3);
      setPageEnd(pageEnd - 3);
    }
  };

  return (
    <div className="mt-4 flex justify-between items-center">
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => {
            handlePageChange(currentPage - 1);
            updatePageRange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? "bg-gray-300" : "bg-blue-300"} px-4 py-2 rounded-md hover:bg-gray-400`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              onClick={() => {
                handlePageChange(pageNumber);
                updatePageRange(pageNumber);
              }}
              className={`px-4 py-2 border-2 rounded-md hover:bg-gray-400 ${currentPage === pageNumber ? "bg-blue-300" : "bg-white"}`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => {
            handlePageChange(currentPage + 1);
            updatePageRange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className={`${currentPage === totalPages ? "bg-gray-300" : "bg-blue-300"} px-4 py-2 rounded-md hover:bg-gray-400`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
