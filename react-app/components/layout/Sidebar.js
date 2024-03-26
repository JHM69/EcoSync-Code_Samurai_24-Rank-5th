import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { NavLink } from '../common/Links'

import Link from 'next/link'
import { useRouter } from 'next/router'

function Item ({ text, subtitle, icon, href, isActive }) {
  return (
    <Link href={href || '/'}>
    <div className={`flex flex-row my-1 rounded-xl p-3 shadow hover:bg-[#daffce] ${isActive ? 'bg-[#76C75E] text-white hover:bg-[#3a8023]' : 'bg-[#E9E9E9] text-gray-900'}`}>

     <div className='p-3'>
        <img src={`/${isActive ? icon : icon + '-dark'}.png`} width={24} height={24} />
     </div>

     <div className='flex flex-col '>

      <span className='text-lg font-semibold'>{text}</span>
      <span className='text-sm font-light'>{subtitle}</span>

     </div>

    </div>
    </Link>
  )
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => setIsOpen((prev) => !prev)
  const router = useRouter()

  const [activePath, setActivePath] = useState('')

  useEffect(() => {
    setActivePath(router.pathname)
  }, [router.pathname])

  const [type, setType] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'))
      setType(user?.role.type)
      if (!user || !user.token) {
        router.push('/login')
      }
    }
  }, [])

  return (
    <>

      <div
        className={clsx(
          'h-max-content border-r-1 smooth-effect  absolute w-screen bg-[#DFDFDF] border-[1px] outline-1 p-3 shadow transition-all duration-300 ease-in-out lg:relative lg:block lg:max-w-[15vw] lg:translate-x-0 lg:border-gray-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav
          onClick={handleToggle}
          className={clsx('flex h-full flex-col px-3 py-6')}
        >

      <div className="flex items-center w-full  justify-center p-3">
        <img src="/logo.png" alt="Logo" width={96} height={96} />
      </div>
          {
            type === 'SystemAdmin' && (
              <>
                <Item text='Dashboard' subtitle='Track & Monitor everything' icon='dashboard' href='/' isActive={router.pathname === '/'} />
                <Item text='Users' subtitle='Manage Users & Roles' icon='user' href='/user' isActive={router.pathname === '/user'} />
                <Item text='STS' subtitle='Add STS & STS Managers' icon='sts' href='/sts' isActive={router.pathname === '/sts'} />
                <Item text='Vehicle' subtitle='Manage Vehicles and Billing' icon='vehicle' href='/vehicle' isActive={router.pathname === '/vehicle'} />
                <Item text='Landfill' subtitle='Landfill and its Managers' icon='landfill' href='/landfill' isActive={router.pathname === '/landfill'} />
              </>
            )
          }

        </nav>
      </div>
    </>
  )
}

export default Sidebar
