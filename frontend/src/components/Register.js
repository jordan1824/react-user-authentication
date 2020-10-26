import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'

function Register({ dispatch }) {
  const history = useHistory()
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Logout user if user was logged in
  useEffect(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  function handleInputChange(e) {
    setUser({ ...user, [e.currentTarget.name]: e.currentTarget.value })
  }

  async function handleRegister(e) {
    e.preventDefault()
    // Confirms fields have been filled out
    if (!user.username || !user.email || !user.password || !user.confirmPassword) {
      alert('One or more fields are blank.')
      return
    }
    // Confirms passwords match
    if (user.password !== user.confirmPassword) {
      alert('Your passwords do not match.')
      setUser({ ...user, password: '', confirmPassword: '' })
      return
    }
    // Sends off request to save user in database
    try {
      const response = await axios.post('/register', {
        username: user.username,
        email: user.email,
        password: user.password
      })
      history.push('/login')
      alert('Account was created')
    } catch (err) {
      setUser({ username: '', email: '', password: '', confirmPassword: '' })
      alert(err.response.data)
    }
  }
  return (
    <>
      <div>Register</div>
      <form onSubmit={handleRegister}>
        <input type="text" name="username" value={user.username} onChange={e => handleInputChange(e)} />
        <input type="text" name="email" value={user.email} onChange={e => handleInputChange(e)} />
        <input type="password" name="password" value={user.password} onChange={e => handleInputChange(e)} />
        <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={e => handleInputChange(e)} />
        <button type="submit">Register</button>
      </form>
      <Link to="/">Go to homepage</Link>
    </>
  )
}

export default Register
