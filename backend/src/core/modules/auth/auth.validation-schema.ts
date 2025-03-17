import * as yup from 'yup';

export const loginValidationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required')
});

export const registerValidationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['user', 'mentor', 'admin']).default('user')
});