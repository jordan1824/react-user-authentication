import React, { useReducer } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Components
import Homepage from './components/Homepage'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('userwebtoken')),
    user: {
      token: '',
      username: ''
    }
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'LOGIN':
        localStorage.setItem('userwebtoken', action.payload.token)
        localStorage.setItem('username', action.payload.username)
        return { ...state, loggedIn: true, user: { token: action.payload.token, username: action.payload.username } }
      case 'LOGOUT':
        localStorage.removeItem('userwebtoken')
        localStorage.removeItem('username')
        return { ...state, loggedIn: false, user: { token: '', username: '' } }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Homepage state={state} dispatch={dispatch} />
        </Route>
        <Route path="/login">
          <Login dispatch={dispatch} />
        </Route>
        <Route path="/register">
          <Register dispatch={dispatch} />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
