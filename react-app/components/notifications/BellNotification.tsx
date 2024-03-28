import { useRouter } from 'next/router'
import { useState } from 'react'

import Modal from './Modal'
import Notifications from './Notifications'
import { BiBell } from 'react-icons/bi'

export default function BellNotification() {
  const [showModal, setShowModal] = useState(false)

  const handleOnClickBellBtn = () => {
    setShowModal(!showModal)
  }

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
      <button onClick={handleOnClickBellBtn} className=" mr-4 h-9 w-9">
        <BiBell className="h-10 w-10 rounded-full bg-green-500 p-1 font-bold text-white " />
        {/* {socketCtx?.notificationSignal && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )} */}
      </button>
    </>
  )
}
