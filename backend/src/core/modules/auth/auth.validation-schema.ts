import * as yup from 'yup';
import { UserCreationAttributes } from '../../../models';
import { UserLoginAttributes } from '../../../models';

export const loginValidationSchema:yup.ObjectSchema<UserLoginAttributes> = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required')
});

export const registerValidationSchema:yup.ObjectSchema<UserCreationAttributes> = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['user', 'trainer', 'admin']).default('user')
});

// ObjectSchema enforces that the schema exactly matches UserCreationAttributes