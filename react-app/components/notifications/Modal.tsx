import { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa'; // Removed FaCross since it's not used

 
const NotificationModal = ({ onClose, children, title }) => {
  const [isOpen, setIsOpen] = useState(true);

  const closeNotificationModal = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div
      className={`fixed top-10 right-100  bg-[#ffffff] rounded-xl border-[2px] w-[230px] lg:w-[360px] z-50 m-2 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
       
    >
      <div className="w-full  rounded-xl   p-4 shadow-lg transition-transform duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold ">
            {title}
          </h2>
          <button
            className="rounded-full   focus:outline-none"
            onClick={closeNotificationModal}
          >
            <FaTimesCircle className="h-6 w-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default NotificationModal;
