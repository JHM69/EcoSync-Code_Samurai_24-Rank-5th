import { useForm } from 'react-hook-form' 
import Button from '../components/common/Button' 
import Layout from '../components/layout'
import { useState } from 'react'  
import { useAuth } from '../components/Context/AuthContext'
import { getBaseUrl } from '../utils/url'
import axios from 'axios'
 

function Index() { 
  const [loading, setLoading] = useState(false)
  const [user , setUser] = useState({})
  const { isLoggedIn, login, logout } = useAuth();


  useState(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      login();
      setUser(user);
    }
    }
  
  }, []);


  const onSubmit = async (data) => {
    try {
      const dataInput = {
        user : {
          email: user.username,
          pass: user.password
        }
      }
      setLoading(true)
      const response = await axios.post(getBaseUrl() + '/users/login', dataInput, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem('user', JSON.stringify(data.user));
        login();
        document.cookie = `Token=${data.user.token}; Secure; HttpOnly; SameSite=Strict`;
  
        window.location.href = '/';
      } else {
        console.log(res.json())
        alert('Wrong username or password')
      }
      setLoading(false) 
    } catch (error) {
      setLoading(false)
      console.log(error)
    }

  }

  return (
    <header className="flex h-full flex-col items-center justify-center sm:max-lg:min-h-[85vh]">
      <img src="/logo.png" alt="logo" className="w-24 mb-4" />

      <h1 className="mb-3 text-3xl font-bold">Shuno CMS</h1>
      <p className="mb-2 text-sm text-gray-500">Manage Songs, Albums, Artist, Podcast etc</p>

      {
        isLoggedIn ? (
<div className='flex justify-center flex-col'>
  <div className='text-3xl'>Welcome {user.username}</div>


  <Button onClick={(e) => {
    e.preventDefault()
    localStorage.removeItem('user') 
    logout(); 
    setUser({})
    setLoading(false)
  }} className="mt-4 justify-center flex items-center" loading={loading}> Logout </Button>

</div>
        ):(
          <div className='flex flex-col'>
      <div className=' '>Username</div>
          <input 
            className='block w-full border border-solid bg-white bg-clip-padding px-4 py-2 font-normal text-gray-700 focus:ring-2'
            name="username"
            label="Username"
            type="text"  
            onChange={e => setUser({ ...user, username: e.target.value })}
            value={user?.username}
             
          />
          <div className=' mt-2 '>Password</div>

          <input 
            className=' block w-full border border-solid bg-white bg-clip-padding px-4 py-2 font-normal text-gray-700 focus:ring-2'
            value={user?.password}
            onChange={e => setUser({ ...user, password: e.target.value })}
            name="password"
            label="Password"  
            type="password"
          />
            
      
        <Button type="submit" onClick={onSubmit} className="mt-4" loading={loading}> Sign In </Button>
      </div>
        )
      }
    </header>
  )
}

export default Index

Index.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
