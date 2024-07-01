import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "axios";
import classes from '../login/login.module.css';

const schema = yup.object().shape({
  password: yup.string().required('Mật khẩu mới là bắt buộc'),
});

const ResetPassword = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`http://localhost:4000/v1/api/reset-password`, {
        password: data.password,
        token: token 
      });
      if (res.data.status === 403) {
        throw new Error('Error');
      }
      if (res.data.status === 200) {
        setSuccess(true);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error reset password:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Phần mềm gia phả</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="password">
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="New password"
            />
            {errors.password && (
              <p className={classes.error}>{errors.password.message}</p>
            )}
          </label>
          <button className={classes.submitBtn}>Thay đổi mật khẩu</button>
        </form>
        {success && (
          <div className={classes.successMessage}>
            Thay đổi mật khẩu mới thành công!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
