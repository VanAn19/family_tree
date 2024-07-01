import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import classes from '../login/login.module.css';

const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const schema = yup.object().shape({
    email: yup.string().matches(emailRegExp, 'Email không hợp lệ').required('Vui lòng nhập email của bạn'),
});

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.get(`http://localhost:4000/v1/api/forgot-password`, {
        params: {
          email: data.email
        }
      });
      if (res.data.status === 404) {
        throw new Error('Email không tồn tại');
      }
      if (res.data.status === 200) setSuccess(true);
    } catch (error) {
      console.error('Error forgot password:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Phần mềm gia phả</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className={classes.error}>{errors.email.message}</p>
            )}
          </label>
          <button className={classes.submitBtn}>Gửi</button>
        </form>
        {success && (
          <div className={classes.successMessage}>
            Vui lòng kiểm tra email để lấy lại mật khẩu!
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
