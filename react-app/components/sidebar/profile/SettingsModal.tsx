import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { RxCross2 } from 'react-icons/rx';

export const SettingsModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [userLive, setUserLive] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  // Effect for initializing state from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserLive(storedUser);
    setName(storedUser?.name || '');
    setEmail(storedUser?.email || '');
    setImage(storedUser?.image || '');
  }, []);

  const handleUpdate = async () => {
    console.log('update');
    try {
      const res = await axios.put('/profile', {
        name,
        email,
        image,
      });
      let newUser = { ...userLive, name, email, image };
      localStorage.setItem('user', JSON.stringify(newUser));
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    onClose();
    // Consider using Next.js Router for navigation without a full page reload
    window.location.reload();
  };
  return (
    <div
      className={`fixed ${
        open ? 'block' : 'hidden'
      } inset-0 overflow-y-auto z-50`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 backdrop-filter backdrop-blur-md"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-[#ffffff]  rounded-[8px] px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 outline outline-1 outline-gray-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="sm:flex sm:items-start relative">
            <div className="mt-3 text-center sm:text-left">
              <h3 className="text-xl leading-6 font-medium" id="modal-headline">
                Update Profile
              </h3>
              <button
                onClick={onClose}
                className="absolute top-0 right-0 smooth-effect hover:bg-gray-200 p-2 rounded text-lg"
              >
                <RxCross2 />
              </button>
            </div>
          </div>

          <div className="mt-5">
 
            {/* Show the image  */}
            <div className="flex items-center justify-center">
              <img
                src={image}
                height={80}
                width={80}
                alt="profile"
                className="w-20 h-20 rounded-full"
              />
            </div>
            <p className="text-lg font-semibold w-full justify-center text-gray-500">Role : {userLive?.role?.type}</p>
            <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image Link
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter your image link"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        

          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            disabled  
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
 
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#76C75E]"
          />
        </div>


        <button
          className='bg-[#30A986]  smooth-effect w-full my-3 text-white px-4 py-2 rounded-md hover:bg-[#246e62] duration-200'
          onClick={() => {
            handleUpdate
          }}
        >
          Save
        </button>


        <button
          className='bg-[#db3e58]  smooth-effect w-full mb-6 text-white px-4 py-2 rounded-md hover:bg-[#95283a] duration-200'
          onClick={() => {
            signOut()
          }}
        >
          Log out
        </button>


           
        </div>
      </div>
    </div>
  );
};
