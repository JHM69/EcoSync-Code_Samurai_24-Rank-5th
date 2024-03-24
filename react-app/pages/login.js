import React from 'react'
import { useState } from 'react'
 

function login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const onSubmit = async (data) => {
    try {
      const dataInput = {
        user : {
          email: email,
          pass: password
        }
      }
      setLoading(true)
      const response = await axios.post(getBaseUrl() + '/auth/login', dataInput, {
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
    <div>
      <div className="flex items-center justify-center h-screen">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="border-2 border-gray-300 p-2"
          />

          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="border-2 border-gray-300 p-2"
          />

          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-blue-500 text-white p-2"
          >
            Login
          </button>

        

        </div>
    </div>
  )
}

export default login