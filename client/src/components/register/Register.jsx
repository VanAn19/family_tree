import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './register.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/authSlice';
import axios from 'axios';

const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const schema = yup.object().shape({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  name: yup.string().required('Họ tên là bắt buộc'),
  email: yup.string().matches(emailRegExp, 'Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  confirmPass: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận phải trùng khớp').required('Xác nhận mật khẩu là bắt buộc'),
});

const Register = () => {
  const { 
    register: formRegister, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const { username, name, email, password } = data;
    const { confirmPass } = data;

    try {
      if (confirmPass !== password) {
        throw new Error('Mật khẩu xác nhận không trùng khớp');
      }
      setIsLoading(true);
      const res = await axios.post('http://localhost:4000/v1/api/signup', {
        name,
        email,
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      dispatch(register(res.data));
      navigate('/home');
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2500);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Phần mềm gia phả</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">
            <input
              {...formRegister('username')}
              type="text"
              id="username"
              placeholder="Enter username"
            />
          </label>
          {errors.username && <p className={classes.error}>{errors.username.message}</p>}
          <label htmlFor="name">
            <input
              {...formRegister('name')}
              type="text"
              id="name"
              placeholder="Enter name"
            />
          </label>
          {errors.name && <p className={classes.error}>{errors.name.message}</p>}
          <label htmlFor="email">
            <input
              {...formRegister('email')}
              type="email"
              id="email"
              placeholder="Enter email"
            />
          </label>
          {errors.email && <p className={classes.error}>{errors.email.message}</p>}
          <label htmlFor="password">
            <input
              {...formRegister('password')}
              type="password"
              id="password"
              placeholder="Enter password"
            />
          </label>
          {errors.password && <p className={classes.error}>{errors.password.message}</p>}
          <label htmlFor="confirmPass">
            <input
              {...formRegister('confirmPass')}
              type="password"
              id="confirmPass"
              placeholder="Confirm password"
            />
          </label>
          {errors.confirmPass && <p className={classes.error}>{errors.confirmPass.message}</p>}
          <button className={classes.submitBtn} disabled={isLoading}>Đăng ký</button>
          <Link to="/login">
            Đã có tài khoản? <p className={classes.login}>Đăng nhập</p>
          </Link>
        </form>
        {error && (
          <div className={classes.errorMessage}>
            Wrong credentials! Try different ones.
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
