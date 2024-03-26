import { useRouter } from 'next/router';
import { useState } from 'react';
 
import Modal from './Modal';
import Notifications from './Notifications';
import { BiBell } from 'react-icons/bi';

export default function BellNotification() {

  const [showModal, setShowModal] = useState(false);

  const handleOnClickBellBtn = () => {
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={'Notification'}>
          <div className="h-[550px]   overflow-auto">
            <div className="overflow-hidden">
              <Notifications on={showModal} />
            </div>
          </div>
        </Modal>
      )}
      <button onClick={handleOnClickBellBtn} className=" h-9 w-9 mr-4">
        <BiBell className="h-8 w-8 font-bold " />
        {/* {socketCtx?.notificationSignal && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )} */}
      </button>
    </>
  );
}
