import * as yup from 'yup';
import { UserCreationAttributes, UserUpdateAttributes } from '../../../models';

export const createUserValidationSchema:yup.ObjectSchema<UserCreationAttributes> = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 5 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['admin', 'user', 'trainer'], 'Invalid role').default('user'),
	avatarUrl: yup.string().optional()
});

export const updateUserValidationSchema:yup.ObjectSchema<UserUpdateAttributes> = yup.object({
  username: yup.string().optional(),
  email: yup.string().email('Invalid email format').optional(),
  password: yup.string().min(8, 'Password must be at least 5 characters').optional(),
  role: yup.string().oneOf(['admin', 'user', 'trainer'], 'Invalid role').optional(),
	avatarUrl: yup.string().optional()
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  (value) => {
    return Object.keys(value).length > 0;
  }
);

// ObjectSchema enforces that the schema exactly matches UserCreationAttributes