import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

function Homepage({ state, dispatch }) {
  const history = useHistory()

  useEffect(() => {
    if (!state.loggedIn) {
      history.push('/login')
    }
  }, [state.loggedIn])

  function handleLogout() {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <>
      <div>Homepage</div>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Homepage
