import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../redux/authSlice'
import classes from './login.module.css'

const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        try {
            console.log(username, password)
            const res = await fetch(`http://localhost:4000/v1/api/login`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({username, password})
            })
            if(res.status === 404){
                throw new Error("Wrong credentials")
            }
            const data = await res.json()
            dispatch(login(data))
            navigate('/home')
        } catch (error) {
            setError(prev => true)
            setTimeout(() => {
                setError(prev => false)
            }, 2500)
            console.error(error)
        }
      }

  return (
    <div className={classes.container}>
        <div className={classes.wrapper}>
            <h2 className={classes.title}>Phần mềm gia phả</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">
                    <input onChange={(e) => setUsername(e.target.value)} type="username" id='username' placeholder='Enter username'/>
                </label>
                <label htmlFor="password">
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id='password' placeholder='Enter password'/>
                </label>
                <button className={classes.submitBtn}>Đăng nhập</button>
                <Link to="/register">Chưa có tài khoản? <p className={classes.register}>Đăng kí tại đây</p></Link>
            </form>
            {error && 
           <div className={classes.errorMessage}>
                Wrong credentials! Try different ones.
            </div>
            }
        </div>
    </div>
  )
}

export default Login