import React, { useEffect, useRef } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import axios from 'axios';
import Image from 'next/image';
import qweekLogo from '/public/qweekLogo.png';

const SearchModal = ({ closeModal }: any) => {
  // pages shallow state
  const inputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = React.useState<any[]>([]);

  const [query, setQuery] = React.useState<string>('');
  const [type, setType] = React.useState<string>('AI search');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

 
  console.log('result', result);

  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center md:items-start z-50">
      <div className="flex items-center justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-slate-100 opacity-80"></div>
        </div>

        {/* Modal panel */}
        <div className="animate__animated  animate__fadeInDown inline-block  min-h-80 bg-[#DFDFDF] border-[1px] rounded-2xl border-gray-100 shadow-2xl text-left overflow-hidden outline-1  transform transition-all  sm:my-8 align-middle md:align-bottom  lg:w-[35rem]">
          <div className="sm:p-6 sm:pb-4 px-2 md:pt-2 md:pb-4 flex flex-col gap-y-3">
            <div className="relative">
              <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="flex items-center gap-x-4">
                  {/* search Input */}
                  <div className="w-full">
                    <input
                      ref={inputRef}
                      className="flex h-10 w-full rounded   bg-transparent px-3 py-2 text-sm  focus:outline-none   disabled:opacity-50"
                      type="text"
                      placeholder="Search anything or any setting Keyword "
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    ></input>
                  </div>
                  {/* close modal */}
                  <button>
                    <RxCrossCircled
                      onClick={closeModal}
                      className="w-6 h-6 absolute top-1 md:top-0 -right-1 md:-right-4  hover:bg-[#d6d6d6]  hover:rounded-full cursor-pointer"
                    />
                  </button>
                </div>
                <hr   />
              </div>
            </div>

            {/* filter option */}
            <div className="flex ml-3 items-center gap-x-2">
            
            </div>

            <div className="flex items-center justify-center">
              {loading && (
                <div className="flex items-center justify-center h-24">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-12 w-12 text-[#2ecba2]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0116 0H4z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>

            {/* search result */}
            <div className="note-list-container overflow-y-auto max-h-72 p-4">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
