import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Meta from './Meta'
import Sidebar from './Sidebar'
import ApplicationBar from '.././ApplicationBar'

const Layout = ({ meta, children, ...props }) => {
  const router = useRouter()

  const { activePageId, activeTabPageId } = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // check if user is logged in
  // if not, redirect to login page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || !user.token) {
        router.push('/login')
      }
    }
  }, [])
  return (
    <div className="max-w-screen min-h-screen lg:flex">
      <Meta {...meta} />
      <Sidebar/>
      <div className="mx-auto flex w-full flex-col">

      <ApplicationBar
              activeTabPageId={activeTabPageId}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />

        <main className="flex-1 px-2 py-2 md:px-6" {...props}>
          {children}
        </main>
        {router.pathname === '/' && <Footer />}
      </div>
    </div>
  )
}

export default Layout
