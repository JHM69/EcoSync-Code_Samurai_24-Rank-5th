/* eslint-disable indent */
/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */

import { useState } from 'react'
import Layout from '../components/layout'
import Dashboard from '../components/Dashboard/Admin'
import { NoSSR } from '../components/common/NoSSR'
import { getToken,getMessaging } from 'firebase/messaging'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../firebase'


function Index() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})

 async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const token = await getToken(messaging, { vapidKey: 'BD-sZ1qm1L6xGXotL17_bw6Awo8gwL4ttD0redOqz2Cch4Ik0W5XgzLBRHBWYWjQ3bEDxD5xiOnuxjhhNHopcJs' });
      console.log("fcm token ",token);
    } else {
      alert('Enable Notification Permission to get the important updates.');
      console.log('Unable to get permission to notify.');
    }
  }
  useState(() => {
    try {
      const u = localStorage.getItem('user')
      if (u) {
        setLoading(false)
        setUser(JSON.parse(u))
        requestNotificationPermission()
      }
    } catch (e) {}
  })
  return (
    <NoSSR>
      <div className="  flex  w-full flex-col gap-1 rounded-xl bg-white p-3 shadow">
        
        {loading ? (
          <div className=" flex w-full  flex-col items-center gap-1 rounded-xl bg-white p-3 shadow">
            <div className="flex w-full flex-col items-center  justify-center bg-white">
              <img src="/logo.png" alt="logo" className="mb-6 w-48" />
              <p className="mb-4 text-center text-gray-600">
                EcoSync is a platform that helps you to manage your waste and
                recycling needs.
              </p>
              <br />
              <br />
              <p className="text-center text-gray-600">
                Copyright &copy; 2024 Quantum Guys - Jagannath University.
                <br /> All rights reserved.
              </p>
            </div>
          </div>
        ) : user && user.role.type === 'SystemAdmin' ? (
          <Dashboard/>
        ) : (
          <div className="  flex w-full  flex-col items-center gap-1 rounded-xl bg-white p-3 shadow">
            <div className="flex w-full flex-col items-center  justify-center bg-white">
              <img src="/logo.png" alt="logo" className="mb-6 w-48" />
              <p className="mb-4 text-center text-gray-600">
                EcoSync is a platform that helps you to manage your waste and
                recycling needs.
              </p>
              <br />
              <br />
              <p className="text-center text-gray-600">
                Copyright &copy; 2024 Quantum Guys - Jagannath University.
                <br /> All rights reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </NoSSR>
  )
}

export default Index

Index.getLayout = function getLayout(page) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Layout>{page}</Layout>
}
