/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import Layout from '../components/layout'
import Dashboard from '../components/Dashboard/Admin'

function Index () {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})
  useState(() => {
    try {
      const u = localStorage.getItem('user')
      if (u) {
        setUser(JSON.parse(u))
      }
    } catch (e) {
      console.log(e)
    }
  })
  return (
    <div className="flex h-[100vh]   w-full flex-col gap-1 rounded-2xl bg-white p-3 shadow">
      <div className="flex flex-col ">
        {/* Good Morning or Good Noon or Good Afternoon or Good Evening or Good Night based on localtime */}
        <h1 className="text-2xl font-bold text-gray-700">
          {new Date().getHours() < 6
            ? 'Good Morning'
            : new Date().getHours() < 12
            ? 'Good Noon'
            : new Date().getHours() < 18
            ? 'Good Afternoon'
            : new Date().getHours() < 21
            ? 'Good Evening'
            : 'Good Night'}{' '}
          {user.name}
        </h1>

      </div>
      <Dashboard />
    </div>
  )
}

export default Index

Index.getLayout = function getLayout (page) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Layout>{page}</Layout>
}
