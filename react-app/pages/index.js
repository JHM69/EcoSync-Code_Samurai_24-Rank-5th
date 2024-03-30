/* eslint-disable multiline-ternary */
/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import Layout from '../components/layout'
import Dashboard from '../components/Dashboard/Admin'
import { NoSSR } from '../components/common/NoSSR'

function Index () {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})
  useState(() => {
    try {
      const u = localStorage.getItem('user')
      if (u) {
        setLoading(false)
        setUser(JSON.parse(u))
      }
    } catch (e) {

    }
  })
  return (
    <NoSSR>
      <div className="h-[100vh] flex   w-full flex-col gap-1 rounded-2xl bg-white p-3 shadow">
        <div className="flex flex-col ">
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

        {loading ? (
          <div className="h-[100vh] flex w-full  flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow">
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
          <Dashboard />
        ) : (
          <div className="h-[100vh] flex w-full  flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow">
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

Index.getLayout = function getLayout (page) {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <Layout>{page}</Layout>
}
