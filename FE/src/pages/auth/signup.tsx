import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signup } from '../../services/auth/auth';

const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(30, 'Name must be less than 30 characters'),
  email: yup.string().email('Email must be valid').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(30, 'Password must be less than 30 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
//   avatar: yup.string().url('Avatar must be a valid URL').optional(),
});

const Signup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await signup(data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...register('name')} />
        <p>{errors.name?.message}</p>
      </div>
      <div>
        <label>Email</label>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        <p>{errors.password?.message}</p>
      </div>
      <div>
        <label>Confirm Password</label>
        <input type="password" {...register('confirmPassword')} />
        <p>{errors.confirmPassword?.message}</p>
      </div>
      {/* <div>
        <label>Avatar</label>
        <input {...register('avatar')} />
        <p>{errors.avatar?.message}</p>
      </div> */}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
