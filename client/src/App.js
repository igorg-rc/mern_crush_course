import React from 'react'
import { Navbar } from './components/Navbar'
import { AuthContext } from './context/AuthContext'
import { useAuth } from './hooks/auth.hook'
import { useRoutes } from './routes'
import { Loader } from './components/Loader'

export const App = () => {
  const { token, login, logout, userId, ready } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      { isAuthenticated && <Navbar /> }
      <div className="">
        {routes}
      </div>
    </AuthContext.Provider>
  );
}

