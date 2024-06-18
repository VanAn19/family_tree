import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import classes from "./register.module.css";
import { useDispatch } from "react-redux";
import { register } from "../../redux/authSlice";
import * as yup from 'yup';

const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const schema = yup.object().shape({
    email: yup.string().matches(emailRegExp, 'Email không hợp lệ').required('Email là bắt buộc'),
    password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});
const schemaConfirm = yup.object().shape({
    emailConfirm: yup.string().matches(emailRegExp, 'Email không hợp lệ').required('Email là bắt buộc'),
});

const Register = () => {

    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRegister = async(e) => {
        e.preventDefault();
        if (confirmPass !== password) return;
        try {
            const res = await fetch('http://localhost:4000/v1/api/signup',{
            headers: {
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify({name,email,username,password})
            })
        if(res.status === 500){
            throw new Error("Wrong credentials")
        }
        const data = await res.json()
        dispatch(register(data))
        navigate("/home")
        } catch (error) {
            setError(prev => true)
            setTimeout(() => {
            setError(prev => false)
        },2500)
            console.error(error);
        }
    }
      
    return (
        <div className={classes.container}>
          <div className={classes.wrapper}>
            <h2 className={classes.title}>Phần mềm gia phả</h2>
            <form onSubmit={handleRegister}>
              <label htmlFor="username">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  placeholder="Enter username"
                />
              </label>
              <label htmlFor="name">
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  id="name"
                  placeholder="Enter name"
                />
              </label>
              <label htmlFor="email">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  placeholder="Enter email"
                />
              </label>
              <label htmlFor="password">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  placeholder="Enter password"
                />
              </label>
              <label htmlFor="confirmPass">
                <input
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type="password"
                  id="confirmPass"
                  placeholder="Confirm password"
                />
              </label>
              <button className={classes.submitBtn}>Đăng ký</button>
              <Link to="/login">
                Đã có tài khoản? <p className={classes.login}>Đăng nhập tại đây</p>
              </Link>
            </form>
            {error &&
              <div className={classes.errorMessage}>
                Wrong credentials! Try different ones.
              </div>
            }
          </div>
        </div>
      );
}

export default Register