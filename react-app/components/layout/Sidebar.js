/* eslint-disable multiline-ternary */
/* eslint-disable eqeqeq */
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getBaseUrl } from '../../utils/url'
import { set } from 'react-hook-form'

function Item({ text, subtitle, icon, href, isActive }) {
  return (
    <Link href={href || '/'}>
      <a
        className={`smooth-effect my-1 mb-2 flex flex-row items-center justify-start rounded p-2 shadow hover:bg-green-100 ${
          isActive
            ? 'bg-green-500 text-white hover:bg-green-700 hover:text-white'
            : 'bg-white text-gray-900'
        }`}
      >
        <div className="p-3 pr-5">
          <img
            src={`/${isActive ? icon : icon + '-dark'}.png`}
            width={24}
            height={24}
          />
        </div>

        <div className=" flex-col hidden md:hidden lg:flex">
          <span className="text-md font-semibold">{text}</span>
          <span className="text-xs font-light">{subtitle}</span>
        </div>
      </a>
    </Link>
  )
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const handleToggle = () => setIsOpen((prev) => !prev)
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [activePath, setActivePath] = useState('')

  const [managedSts, setManagedSts] = useState([])
  const [managedLandfills, setManagedLandfills] = useState([])
  const [managedContractors, setManagedContractors] = useState([])

  useEffect(() => {
    setActivePath(router.pathname)
  }, [router.pathname])

  const [type, setType] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || !user.token) {
        router.push('/login')
      }
      setType(user?.role?.type)
      if (user?.role?.type === 'STSManager') {
        setLoading(true)
        const token = localStorage.getItem('token')
        console.log({ token })
        const res = axios
          .get(getBaseUrl() + '/mysts', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if(response.data.length > 0) {
              response.data.sort((a, b) => a?.id - b?.id)
            }
            setManagedSts(response.data)
            setLoading(false)
            console.log(response)
            router.push('/vehicle-entry/' + response.data[0].id)
          })
          .catch((error) => {
            setLoading(false)
            console.log(error)
          })
        console.log({ res })
      } else if (user?.role?.type === 'LandfillManager') {
        setLoading(true)
        const token = localStorage.getItem('token')
        console.log({ token })
        const res = axios
          .get(getBaseUrl() + '/mylandfills', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if(response.data.length > 0) {
              response.data.sort((a, b) => a?.id - b?.id)
            }
            setManagedLandfills(response.data)
            setLoading(false)
            console.log(response)
            router.push('/truck-dump-entry/' + response.data[0].id)
          })
          .catch((error) => {
            setLoading(false)
            console.log(error)
          })
        console.log({ res })
      } else if (user?.role?.type === 'ContractorManager') {
        setLoading(true)
        const token = localStorage.getItem('token')
        console.log({ token })
        const res = axios
          .get(getBaseUrl() + '/myContractors', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if(response.data.length > 0) {
              response.data.sort((a, b) => a?.id - b?.id)
            }
            setManagedContractors(response.data)
            setLoading(false)
            console.log(response)
            router.push('/contractor/' + response.data[0].id)
          })
          .catch((error) => {
            setLoading(false)
            console.log(error)
          })
        console.log({ res })
      } else if (user?.role?.type === 'SystemAdmin') {
        // do nothing
      } else {
        router.push('/login')
      }
    }
  }, [])

  return (
    <>
      <div
        className={clsx(
          'h-max-content border-r-1 smooth-effect  absolute w-screen border-[1px] bg-gradient-to-bl from-white to-white shadow outline-1 transition-all duration-300 ease-in-out lg:relative lg:block lg:max-w-[20vw] md:max-w-[10vw] lg:bg-slate-500',
          isOpen ? 'translate-x-0 ' : '-translate-x-full '
        )}
      >
        <nav className={clsx('flex h-full flex-col')}>
          <div className="-lg flex w-full items-center justify-center bg-white p-3">
            <img src="/logo.png" alt="Logo" width={96} height={96} />
          </div>
          <div className="p-5">
            {type === 'SystemAdmin' && (
              <>
                <Item
                  text="Dashboard"
                  subtitle="Track & Monitor everything"
                  icon="dashboard"
                  href="/"
                  isActive={router.pathname === '/'}
                />
                 <Item
                  text="Trip Plans"
                  subtitle="Plan or Auto Generate the Truck Trips"
                  icon="tripplan"
                  href="/tripplan"
                  isActive={router.pathname === '/tripplan'}
                />
                 <Item
                  text="Bills"
                  subtitle="Manage Bills & Payments"
                  icon="bills"
                  href="/bills"
                  isActive={router.pathname === '/bills'}
                />
                <Item
                  text="Users"
                  subtitle="Manage Users & Roles"
                  icon="user"
                  href="/user"
                  isActive={router.pathname === '/user'}
                />
                <Item
                  text="STS"
                  subtitle="Add STS & STS Managers"
                  icon="sts"
                  href="/sts"
                  isActive={router.pathname === '/sts'}
                />
                <Item
                  text="Vehicle"
                  subtitle="Manage Vehicles and Billing"
                  icon="vehicle"
                  href="/vehicle"
                  isActive={router.pathname === '/vehicle'}
                />
                <Item
                  text="Landfill"
                  subtitle="Landfill and its Managers"
                  icon="landfill"
                  href="/landfill"
                  isActive={router.pathname === '/landfill'}
                />
                <Item
                  text="Contractor"
                  subtitle="Contactor and its Managers"
                  icon="contractor"
                  href="/contractor"
                  isActive={router.pathname === '/contractor'}
                />
              </>
            )}
            {type === 'STSManager' && (
              <>
                {loading ? (
                  <p className=" w-full text-center font-bold text-red-600   ">
                    Loading STS...
                  </p>
                ) : managedSts.length > 0 ? (
                  managedSts.map((sts, index) => (
                    <Item
                      key={index}
                      text={sts.name || ('STS of ' + 'Ward ' + sts.wardNumber)}
                      subtitle={sts.address}
                      icon="sts"
                      href={`/vehicle-entry/${sts.id}`}
                      isActive={router.query.stsId === sts.id.toString()}
                    />
                  ))
                ) : (
                  <p className=" w-full text-center font-bold text-red-600   ">
                    No STS Assigned Yet
                  </p>
                )}
              </>
            )}
            {type === 'LandfillManager' && (
              <>
                {loading ? (
                  <p className=" w-full text-center font-bold text-red-600   ">
                    Loading Landfills...
                  </p>
                ) : managedLandfills.length > 0 ? (
                  managedLandfills.map((landfill, index) => (
                    <Item
                      key={index}
                      text={landfill.name}
                      subtitle={landfill.address}
                      icon="landfill"
                      href={`/truck-dump-entry/${landfill.id}`}
                      isActive={
                        router.query.landfillId === landfill.id.toString()
                      }
                    />
                  ))
                ) : (
                  <p className=" w-full text-center font-bold text-red-600   ">
                    No Landfill Assigned Yet
                  </p>
                )}
              </>
            )}

{type === 'ContractorManager' && (
              <>
                {loading ? (
                  <p className=" w-full text-center font-bold text-red-600   ">
                    Loading Contractors...
                  </p>
                ) : managedContractors.length > 0 ? (
                  managedContractors.map((contractor, index) => (
                    <Item
                      key={index}
                      text={contractor.companyName}
                      subtitle={contractor.tin}
                      icon="contractor"
                      href={`/contractor/${contractor.id}`}
                      isActive={
                        router.query.contractorId === contractor.id.toString()
                      }
                    />
                  ))
                ) : (
                  <p className=" w-full text-center font-bold text-red-600   ">
                    No ContractorManager found
                  </p>
                )}
              </>
            )}

          </div>
        </nav>
      </div>
      <button
        className="fixed top-0 left-0 z-10 rounded-full bg-white p-3"
        onClick={handleToggle}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>
    </>
  )
}

export default Sidebar
