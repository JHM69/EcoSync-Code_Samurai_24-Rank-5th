/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getBaseUrl } from '../../utils/url'
import ContractorItemsSkeleton from '../../components/Contractors/ContractorItemsSkeleton'
import ContractorEntryItems from '../../components/ContractorEntrys/ContractorEntryItems'
import Layout from '../../components/layout'
import MapView from '../../components/common/MapView'
import AddWasteEntry from '../../components/WasteEntry/AddWasteEntry'
import WasteItemsSkeleton from '../../components/WasteEntrys/WasteEntryItemsSkeleton'
import WasteEntryItems from '../../components/WasteEntrys/WasteEntryItems'
import { NoSSR } from '../../components/common/NoSSR'
import ProgressBar from '../../components/common/ProgressBar'
import AddContractorEntry from '../../components/ContractorEntry/AddContractorEntry'
import MonitoringEntryItem from '../../components/ContractorEntrys/MonitoringItem'
import MonitorItemEntries from '../../components/ContractorEntrys/MonitoringEntryItems'
import ContractorBillItems from '../../components/ContractorEntrys/ContractorBillItems'
import CollectionPlanItems from '../../components/ContractorEntrys/CollectionPlanItems'
import AddCollectionPlanEntry from '../../components/ContractorEntry/AddCollectionPlanEntry'

const Tab = ({ label, isActive, onClick }) => (
  <div
    className={`smooth-effect cursor-pointer rounded p-3 px-5 ${
      isActive
        ? 'bg-green-500 font-bold text-white hover:bg-green-600'
        : 'hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    {label}
  </div>
)

// Navigation bar component
const NavigationBar = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex w-full flex-row items-center justify-between gap-8 rounded bg-gray-200 p-2 text-black">
    {tabs.map((tab) => (
      <Tab
        key={tab.key}
        label={tab.label}
        isActive={activeTab === tab.key}
        onClick={() => setActiveTab(tab.key)}
      />
    ))}
  </div>
)

export default function ContractorEntry() {
  const [loading, setLoading] = useState(true)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [contractorEntries, setContractorEntries] = useState([])
  const [monitorEntries, setMonitorEntries] = useState([])
  const [contractorBills, setContractorBills] = useState([])
  const [collectionPlans, setCollectionPlans] = useState([]) 
  const [trackers, setTrackers] = useState([]) 

  const [activeTab, setActiveTab] = useState('employee')
  const tabs = [
    { key: 'employee', label: 'Employees' },
    { key: 'loggedHours', label: 'Logged Hours' },
    { key: 'collectionPlan', label: 'Collection Plan' },
    { key: 'workforceTracking', label: 'Workforce Tracking' },
  ]

  const [contractor, setContractor] = useState({})

  const [contractorId, setContractorId] = useState('')

  const router = useRouter()

  useEffect(() => {
    setContractorId(router.query.contractorId)
  }, [router.query.contractorId])

  useEffect(() => {
    setLoadingInfo(true)
    if (contractorId === '') return
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(getBaseUrl() + `/contractor/${contractorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoadingInfo(false)
          setContractor(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          setLoadingInfo(false)
          console.log(err)
        })
    }
  }, [contractorId])

  useEffect(() => {
    if (contractorId === null) return
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/contractor/${contractorId}/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data)
          res.data.sort((a, b) => b.id - a.id)
          setContractorEntries(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [contractorId])

  useEffect(() => {
    if (contractorId === null) return
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/contractorBill/${contractorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log('res.data,', res.data)

          if (res.data.length > 0) {
            console.log('data is here ')
            setContractorBills(res.data)
            setLoading(false)
          }
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [contractorId])

  useEffect(() => {
    if (contractorId === null) return
    setLoading(true)

    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/monitor/${contractorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log('res.data')

          setMonitorEntries(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [contractorId])

 
  useEffect(() => {
    if (contractorId === null) return
    setLoading(true)

    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/collectionPlan/contractor/${contractorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log('res.data')

          setCollectionPlans(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [contractorId])



  
 
  useEffect(() => {
    if (contractorId === null) return
    setLoading(true)

    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/tracker/${contractorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log('trackers:: ' , res.data)

          setTrackers(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [contractorId])

 

 
 

  return (
    <NoSSR>
      {contractorId && (
        <div>
          <div className="flex w-full flex-col">


            <NavigationBar
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
             
            {loadingInfo ? (
              <div className="cursor-loading mx-6 my-2 flex animate-pulse space-x-16 rounded-md border px-6 py-4 shadow-sm">
                <div className="m-3 mt-3 h-10 flex-1 rounded bg-gray-200"></div>
                <div className="h-[200px] flex-1 rounded bg-gray-200"></div>
              </div>
            ) : (
              <div className="mx-6 block  max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
                <div className="flex  flex-row ">
                  <div className="w-1/2 gap-4 px-4">
                    <p className="text-md my-2 font-semibold">
                      Company: {contractor.companyName}
                    </p>
                    <p className="text-md  my-2">
                      Registration Number: {contractor.registrationId}
                    </p>
                    {/* <ProgressBar
                  currentWasteVolume={contractor?.currentWasteVolume}
                  capacity={contractor?.capacity}
                /> */}
                  </div>
                  {/* <div className="w-1/2">
                <MapView
                    lat={contractor.lat}
                    lon={contractor.lon}
                    name={contractor.wardNumber}
                    address={contractor.address}
                    height = '200px'
                    // vehicles = {contractor.vehicles}
                />
              </div> */}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row gap-3 md:px-6">
            <div className="flex w-full flex-col">
              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-700">
                  Employee Entries{' '}
                </h1>
                <div className="flex items-center space-x-2">
                  {contractorId && (
                    <AddContractorEntry contractorId={contractorId} />
                  )}
                </div>
              </div>
              {loading ? (
                <ContractorItemsSkeleton />
              ) : (
                <ContractorEntryItems contractorEntries={contractorEntries} />
              )}
            </div>
          </div>

          <div className="flex flex-row gap-3 md:px-6">
            <div className="flex w-full flex-col">
              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-700">
                  Logged Hours
                </h1>
              </div>
              {loading ? (
                <ContractorItemsSkeleton />
              ) : (
                <MonitorItemEntries monitorEntries={monitorEntries} />
              )}
            </div>
          </div>

          <div className="flex flex-row gap-3 md:px-6">
            <div className="flex w-full flex-col">
              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-700">Bills</h1>
              </div>
              {loading ? (
                <ContractorItemsSkeleton />
              ) : (
                <ContractorBillItems contractorBills={contractorBills} />
              )}
            </div>
          </div>

          <div className="flex flex-row gap-3 md:px-6">
            <div className="flex w-full flex-col">
              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-700">
                  Collection Plan
                </h1>

                <div className="flex items-center space-x-2">
                  {contractorId && (
                    <AddCollectionPlanEntry contractorId={contractorId} />
                  )}
                </div>
              </div>
             
              {loading ? (
                <ContractorItemsSkeleton />
              ) : (
                <CollectionPlanItems collectionPlans={collectionPlans} />
              )}
            </div>
          </div>




          <div className="flex flex-row gap-3 md:px-6">
            <div className="flex w-full flex-col">
              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-700">
                  Tracking
                </h1>
 
              </div>
             
              {loading ? (
                <ContractorItemsSkeleton />
              ) : (
                <CollectionPlanItems trackers={trackers} />
              )}
            </div>
          </div>


        </div>
      )}
    </NoSSR>
  )
}

ContractorEntry.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'Contractor Entries' }}>{page}</Layout>
}
