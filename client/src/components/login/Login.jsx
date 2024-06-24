import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '../../redux/authSlice';
import classes from './login.module.css';

// Define validation schema
const schema = yup.object().shape({
  username: yup.string().required('Tên người dùng là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

const Login = () => {
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`http://localhost:4000/v1/api/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.status === 404) {
        throw new Error('Sai tên người dùng hoặc mật khẩu');
      }

      const responseData = await res.json();
      dispatch(login(responseData));
      navigate('/home');
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2500);
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Phần mềm gia phả</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">
            <input
              {...register('username')}
              type="text"
              id="username"
              placeholder="Nhập tên người dùng"
            />
            {errors.username && (
              <p className={classes.error}>{errors.username.message}</p>
            )}
          </label>
          <label htmlFor="password">
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className={classes.error}>{errors.password.message}</p>
            )}
          </label>
          <button className={classes.submitBtn}>Đăng nhập</button>
          <Link to="/register">
            Chưa có tài khoản? <p className={classes.register}>Đăng kí</p>
          </Link>
        </form>
        {error && (
          <div className={classes.errorMessage}>
            Sai tên người dùng hoặc mật khẩu! Vui lòng thử lại.
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
