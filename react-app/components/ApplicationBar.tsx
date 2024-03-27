import * as React from 'react';

import { IoIosMenu } from 'react-icons/io';
import { useEffect } from 'react';
import BellNotification from './notifications/BellNotification';
import SearchBox from './search/SearchBox';
import { SettingsModal } from './sidebar/profile/SettingsModal';
import SwitchLanguage from './common/SwitchLanguage';
/**
 * The top bar of the application, with the model and purpose selection, and menu/settings icons
 */

const ApplicationBar: React.FC<{
  activeTabPageId: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isSidebarOpen, toggleSidebar, activeTabPageId }) => {
 
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
 
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

 
  return (
    <>
      {/* Top Bar with 2 icons and Model/Purpose selectors */}
      <div className="sticky top-0 z-10 md:z-10 w-full ">
        <div className="flex flex-row items-center justify-between w-full border-b border-[#1e1e1e] border-opacity-10 h-16 bg-[#DFDFDF]">
          <button
            onClick={toggleSidebar}
            className={`hover:opacity-75 transition absolute text-white z-30 h-14 w-14 ${
              !isSidebarOpen ? 'block' : 'md:hidden'
            }`}
          >
            <IoIosMenu className="h-6 w-6 mx-auto my-auto" />
          </button>

          {/* search box  */}
          <div className="w-9/12 md:w-6/12">
            <SearchBox />
          </div>

          {/* user photo showing  */}

          <div className="flex items-center justify-between">
           
              <>
              <BellNotification/>
              <div  onClick={toggleModal} className="flex mr-10 flex-row items-center smooth-effect rounded-xl px-3 py-1 bg-green-100 hover:bg-green-300">
               
                <img
                  className="inline-block h-[27px] w-[27px] rounded-full cursor-pointer"
                  src={user?.image || '/logo.png'}
                  alt="avatar"
                  width={36}
                  height={36}
                 
                />
              

                <div className='flex flex-col mx-2 justify-center'>
                  <span className="text-[#1b1b1b] text-[14px] font-bold">{user?.name}</span>
                  <span className="text-[#2e2e2e] text-[11px]">{user?.role?.type}</span>
                </div>
                
              </div>
              <SwitchLanguage />
              </> 
          </div>

          {/* bg for close modal  */}
          <SettingsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
          {isModalOpen && (
            <div
              onClick={() => setIsModalOpen(false)}
              className="z-40 fixed h-screen w-screen"
            ></div>
          )}
        </div>

        
      </div>
    </>
  );
};
export default ApplicationBar;
 