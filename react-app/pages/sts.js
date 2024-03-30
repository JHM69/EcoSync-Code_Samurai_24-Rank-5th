/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import UserItemsSkeleton from '../components/Users/UserItemsSkeleton'
import axios from 'axios'
import { getBaseUrl } from '../utils/url'
import AddSts from '../components/Sts/AddSts'
import StsItems from '../components/Stss/StsItems'
 
function Stss() {
  const [loading, setLoading] = useState(true)
  const [stss, setSts] = useState([])
  const [reload, setReload] = useState(false)
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token.length > 0) {
      axios
        .get(getBaseUrl() + '/sts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data)
          setSts(res.data)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    }
  }, [reload])

  return (
    <div>
      <div className="flex md:px-6 flex-row gap-3">
        <div className="flex w-full flex-col">
          <div className="mt-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-700">STS</h1>
            <div className="flex items-center space-x-2">
              <AddSts  reload={reload} setReload={setReload} />
            </div>
          </div>
          {loading ? <UserItemsSkeleton /> : <StsItems stss={stss}  reload={reload} setReload={setReload}/>}
        </div>
      </div>
    </div>
  )
}

export default Stss

Stss.getLayout = function getLayout(page) {
  return <Layout meta={{ name: 'STS' }}>{page}</Layout>
}
