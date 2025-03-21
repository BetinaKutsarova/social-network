import { UserCreationAttributes, UserLoginAttributes, UserUpdateAttributes } from "../models";

export function isUserCreationAttributes(obj: unknown): obj is UserCreationAttributes {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const requiredProperties = ['username', 'email', 'password', 'role'];

	for (const prop of requiredProperties) {
		if (!(prop in obj)) {
			return false;
		}
	}

	return true;
}

export function isUserLoginAttributes(obj: unknown): obj is UserLoginAttributes {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const requiredProperties = ['email', 'password'];

	for (const prop of requiredProperties) {
		if (!(prop in obj)) {
			return false;
		}
	}

	return true;
}