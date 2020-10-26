import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Login({ dispatch }) {
  const [user, setUser] = useState({
    username: '',
    password: ''
  })
  const history = useHistory()
  // Logout user if user was logged in
  useEffect(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  function handleInputChange(e) {
    setUser({ ...user, [e.currentTarget.name]: e.currentTarget.value })
  }

  async function handleLogin(e) {
    e.preventDefault()
    if (user.username && user.password) {
      try {
        const response = await axios.post('/login', { username: user.username, password: user.password })
        dispatch({ type: 'LOGIN', payload: response.data })
        history.push('/')
      } catch (err) {
        setUser({ username: '', password: '' })
        alert(err.response.data)
      }
    } else {
      alert('One or more fields are blank.')
    }
  }

  return (
    <>
      <div>Login</div>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" value={user.username} onChange={e => handleInputChange(e)} />
        <input type="password" name="password" value={user.password} onChange={e => handleInputChange(e)} />
        <button type="submit">Login</button>
      </form>
      <Link to="/">Go to homepage</Link>
    </>
  )
}

export default Login
