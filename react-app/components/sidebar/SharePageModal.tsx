import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BiCopy } from 'react-icons/bi';
import { IoIosLink } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

type SharePageModalProps = {
  isShareModal: boolean;
  setIsShareModal: (isOpen: boolean) => void;
  link: string;
};

export const SharePageModal: React.FC<SharePageModalProps> = ({
  isShareModal,
  setIsShareModal,
  link,
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        toast.success('Link copied to clipboard!', {
          icon: <IoIosLink />,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setIsShareModal(false);
      },
      (err) => {
        toast.error('Failed to copy link.');
      },
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center h-screen w-screen`}
    >
      <div
        onClick={() => setIsShareModal(false)}
        className="absolute inset-0 bg-black bg-opacity-60"
      ></div>
      <div className="w-max relative z-50 flex-col bg-[#131318] p-5 outline outline-1 outline-gray-700 shadow-lg rounded text-white">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xl font-medium">Share Link</div>
          <button
            onClick={() => setIsShareModal(false)}
            className="bg-gray-300 hover:bg-gray-200 text-black rounded p-2 transition duration-150"
          >
            <RxCross2 />
          </button>
        </div>
        <div className="text-sm mb-4">
          Anyone with the URL will be able to view the shared page.
        </div>
        <div className="mb-4 flex items-center space-x-2 w-full">
          <input
            type="text"
            readOnly
            className="flex-1 p-2 rounded bg-gray-800 text-white"
            value={link}
          />
          <button
            onClick={copyToClipboard}
            className="p-2 bg-green-700 text-white rounded"
            title="Copy"
          >
            <BiCopy />
          </button>
        </div>
      </div>
    </div>
  );
};
