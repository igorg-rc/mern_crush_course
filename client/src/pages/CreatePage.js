import React, { useContext, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'

export const CreatePage = () => {
  const { request } = useHttp()
  const auth = useContext(AuthContext)
  const history = useHistory()
  const [ link, setLink ] = useState('') 


  const pressHandler = async event => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', {from: link}, {
          Authorization: `Bearer ${auth.token}`
        })
        console.log(data)
        history.push(`/detail/${data.link._id}`)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
          <input 
            id="link" 
            name="link" 
            type="text" 
            placeholder="Insert the link"
            autoComplete="off"
            onChange={event => setLink(event.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link"></label>
        </div>
      </div>
    </div>
  )
}