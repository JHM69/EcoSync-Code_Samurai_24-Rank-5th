  
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GiNothingToSay } from 'react-icons/gi';
import axios from 'axios';

 
export default function Notifications(on : any) {
 

  const [notifications, setNotifications] = useState<any>([]);
  const [deleteNotificationsStatus, setDeleteNotificationsStatus] = useState(
    'idle'
  );
 
  const [status, setStatus] = useState('loading');
 
 

  useEffect(() => {
    refetchNotifications();
  }, [on]);
  

 
  useEffect(() => {
    if (deleteNotificationsStatus === 'success') {
      toast.success('Agent has been deactivated!');
      refetchNotifications();
      return;
    }

    if (deleteNotificationsStatus === 'error') {
      toast.error('An error occurred, try again later!');
    }
  }, [deleteNotificationsStatus]);

  // load notifications using axios from api/user/notification
  const refetchNotifications = async () => {
    console.log('refetchNotifications');
    setStatus('loading');
    try {
      const res = await axios.get('/api/user/notification');
      setNotifications(res.data.notifications);
      console.log('res.data.notifications', res.data.notifications);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setStatus('error');
    }
  };
  
  return (
    <>
    <div className="mt-2 flex w-full flex-col">
       
      {notifications && notifications?.length === 0 && (
        <div className="flex w-full  flex-col items-center justify-center gap-2 font-bold ">
          <GiNothingToSay className="h-20 w-20" />
          No notifications found!
        </div>
      )}

       
    </div>
    </>
  );
}
