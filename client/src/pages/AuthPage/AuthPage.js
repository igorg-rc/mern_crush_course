import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook' 
import { useMessage } from '../../hooks/message.hook'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const { loading, request, error, clearError } = useHttp()
  const [ form, setForm ] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])


  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="center-align">
          <h3>Login</h3>
        </div>
        
        <div className="row">
          <div className="card blue darken-1">
            <div className="card-content white-text center-align">
              <h5 className="card-title">Authorization</h5>
              <div className="row">
                <div className="input-field col s12">
                  <input 
                    id="email" 
                    name="email" 
                    type="text" 
                    className="validate" 
                    placeholder="Email"
                    autoComplete="off"
                    defaultValue={form.email}
                    onChange={changeHandler}
                  />
                </div>
                <div className="input-field col s12">
                  <input 
                    id="password" 
                    name="password"
                    type="password" 
                    className="validate" 
                    placeholder="Password"
                    defaultValue={form.password}
                    onChange={changeHandler}
                  />
                </div>
              </div>
            </div>
            <div className="card-action center-align">

              <button 
                className="btn orange darken-2" 
                style={{ marginRight: '10px' }}
                disabled={loading}
                onClick={loginHandler}
              >Login
              </button>

              <button 
                className="btn grey lighten-1 black-text"
                onClick={registerHandler}
                disabled={loading}
              >Register
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}