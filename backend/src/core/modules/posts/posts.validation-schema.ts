import * as yup from 'yup';
import { PostCreationAttributes, PostUpdateAttributes } from '../../../models';

export const createPostValidationSchema: yup.ObjectSchema<PostCreationAttributes> = yup.object({
  userId: yup.string().uuid('Invalid userId format').required('User ID is required'),
  content: yup.string().required('Content is required')
}).test(
  'valid-content-length',
  'Content must be at least 5 characters long',
  (value) => value?.content?.length >= 5
);

export const updatePostValidationSchema: yup.ObjectSchema<PostUpdateAttributes> = yup.object({
  userId: yup.string().uuid('Invalid userId format').optional(),
  content: yup.string().optional()
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  (value) => Object.keys(value).length > 0
);