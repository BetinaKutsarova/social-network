import * as yup from 'yup';
import { PetCreationAttributes, PetUpdateAttributes } from '../../../models';

export const createPetValidationSchema: yup.ObjectSchema<PetCreationAttributes> = yup.object({
	name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
	species: yup.string().required('Species is required').max(50, 'Species cannot exceed 50 characters'),
	breed: yup.string().max(50, 'Breed cannot exceed 50 characters').optional(),
	ageYears: yup.number().positive('Age must be positive').integer('Age must be an integer').optional(),
	bio: yup.string().optional(),
	avatarUrl: yup.string().url('Avatar URL must be a valid URL').max(255, 'URL cannot exceed 255 characters').optional()
}).test(
	'valid-name-length',
	'Name must be at least 2 characters long',
	(value) => !value.name || value.name.length >= 2
);

export const updatePetValidationSchema: yup.ObjectSchema<PetUpdateAttributes> = yup.object({
	name: yup.string().max(50, 'Name cannot exceed 50 characters').optional(),
	species: yup.string().max(50, 'Species cannot exceed 50 characters').optional(),
	breed: yup.string().max(50, 'Breed cannot exceed 50 characters').optional(),
	ageYears: yup.number().positive('Age must be positive').integer('Age must be an integer').optional(),
	bio: yup.string().optional(),
	avatarUrl: yup.string().url('Avatar URL must be a valid URL').max(255, 'URL cannot exceed 255 characters').optional()
}).test(
	'at-least-one-field',
	'At least one field must be provided',
	(value) => Object.keys(value).length > 0
);