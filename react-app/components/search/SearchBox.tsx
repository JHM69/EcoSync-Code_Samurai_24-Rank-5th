import React from 'react';
import { useState } from 'react';
import SearchModal from './SearchModal';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex w-5/6 items-center ml-auto space-x-2">
      <div className="flex items-center rounded-[14px] border-[1px] bg-[#0000000b] border-[#d9d9d952] py-2 px-6 mx-3 md:mx-10 w-full">
        <FaSearch className="text-[#3a3a3a93]" />

        <div className="flex-grow ml-2 w-full">
          <input
            type="text"
            className="w-full border-none outline-none bg-transparent placeholder-[#31313193]"
            placeholder="Search anything or any setting Keyword"
            onClick={openModal}
          />
        </div>
      </div>

      {/* Modal component */}
      {isModalOpen && <SearchModal closeModal={closeModal}></SearchModal>}
    </div>
  );
};

export default SearchBox;
