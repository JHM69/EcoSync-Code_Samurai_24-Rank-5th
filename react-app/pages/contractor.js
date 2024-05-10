/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/layout'
import ContractorItems from '../components/Contractors/ContractorItems'
import { useEffect, useState } from 'react'
import ContractorItemsSkeleton from '../components/Contractors/ContractorItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import AddContractor from '../components/Contractor/AddContractor'
function Contractors() {
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(false)
  const [contractors, setContractors] = useState([])
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + '/contractor', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          if (res.data.length > 0) {
            res.data.sort((a, b) => a?.id - b?.id)
          }
          console.log(res.data)
          setContractors(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [])

  return (
    <div>
      <div className="flex flex-row gap-3 md:px-6">
        <div className="flex w-full flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">Contractors</h1>
            <div className="flex items-center space-x-2">
              <AddContractor reload={reload} setReload={setReload} />
            </div>
          </div>
          {loading ? (
            <ContractorItemsSkeleton />
          ) : (
            <ContractorItems contractors={contractors} reload={reload} setReload={setReload} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Contractors

Contractors.getLayout = function getLayout(page) {
  return (
    <Layout meta={{ name: 'Contractor and Access Control' }}>{page}</Layout>
  )
}
