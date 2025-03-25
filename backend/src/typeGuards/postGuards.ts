import { PostCreationAttributes } from "../models";

export function isUserCreationAttributes(obj: unknown): obj is PostCreationAttributes{
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