'use-client'

/* eslint-disable multiline-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router' 
// import ContractorItemsSkeleton from '../../../components/Contractors/ContractorItemsSkeleton'
// import ContractorItemsSkeleton from '../../../components/Contractors/ContractorItemsSkeleton'
// import ContractorEntryItems from '../../../components/ContractorEntrys/ContractorEntryItems'
import ContractorEntryItems from '../../components/ContractorEntrys/ContractorEntryItems'
import AddContractorEntry from '../../components/ContractorEntry/AddContractorEntry'
import { getBaseUrl } from '../../utils/url'
 



export default function EmployeeTab(contractorId) {
  const [loading, setLoading] = useState(true)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [contractorEntries, setContractorEntries] = useState([])
  const [wasteEntries, setWasteEntries] = useState([])
 
  const [contractor, setContractor] = useState({})


  const router = useRouter()

  const { type } = router.query;

  useEffect(() => {
    if (contractorId === null) {
      //console.log('contractorId is null')
      return
    }
    setLoadingInfo(true)
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get(getBaseUrl() + `/contractor/${contractorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setLoadingInfo(false)
          setContractor(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          alert(err);
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
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log("fdfwd")
          console.log(res.data)
          res.data.sort((a, b) => b.id - a.id)
          setContractorEntries(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.log("fdfwd")
          setLoading(false)
          console.log(err)
        })
    }else{
        console.log("fdfwd")
    }
  }, [contractorId])

  useEffect(() => {
    if (contractorId === null) return
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + `/contractor/${contractorId}/add`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data)
          res.data.sort((a, b) => b.id - a.id)
          setWasteEntries(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [contractorId])


 
  return (
    
        <>
          <div>
            <div className="flex w-full flex-col">
              
            </div>

            <div className="flex flex-row gap-3 md:px-6">
              <div className="flex w-full flex-col">
                <div className="mt-3 flex items-center justify-between">
                  <h1 className="font-bold text-gray-700">
                    Employee Entries{' '}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {contractorId && <AddContractorEntry contractorId={contractorId} />}
                  </div>
                </div>
                {loading ? (
                  <>Loading...</>
                ) : (
                  <ContractorEntryItems contractorEntries={contractorEntries} />
                )}
              </div>

              {/* <div className="flex w-1/3   flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="font-bold text-gray-700">
              Waste Entries
            </h1>
            <div className="flex items-center space-x-2">
              {contractorId && <AddWasteEntry contractorId={contractorId} />}
            </div>
          </div>
          {loading ? (
            <WasteItemsSkeleton />
          ) : (
            <WasteEntryItems wasteEntries={wasteEntries} />
          )}
        </div> */}
            </div>
          </div>
        </>
      
 
  )
}
 