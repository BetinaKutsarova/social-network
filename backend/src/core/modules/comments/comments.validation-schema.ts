import * as yup from 'yup';
import { CommentCreationAttributes, CommentUpdateAttributes } from '../../../models/Comment';

export const createCommentValidationSchema: yup.ObjectSchema<Omit<CommentCreationAttributes, 'userId' | 'postId'>> = yup.object({
  content: yup.string().required('Content is required')
}).test(
  'valid-content-length',
  'Content must be at least 3 characters long',
  (value) => value?.content?.length >= 3
);

export const updateCommentValidationSchema: yup.ObjectSchema<CommentUpdateAttributes> = yup.object({
  content: yup.string().optional()
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  (value) => Object.keys(value).length > 0
);