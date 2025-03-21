import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';

export interface UserAttributes {
	id: string;
	username: string;
	email: string;
	password: string;
	role: 'user' | 'admin' | 'trainer';
}

export type UserDTO = Omit<UserAttributes, 'password'>;
export type UserCreationAttributes = Omit<UserAttributes, 'id'>;
export type UserUpdateAttributes = Partial<UserCreationAttributes>;
export type UserLoginAttributes = Omit<UserAttributes, 'id' | 'username' | 'role'>;

// to convert model instances to UserDTO
export function toDTO(user: User): UserDTO {
	const { password, ...userDTO } = user.get({ plain: true });
	return userDTO;
}

// getter methods for more controlled access for now, the model class always takes 2 types - with all attributes and with creation attributes
class User extends Model<UserAttributes, UserCreationAttributes> {
	get id(): string {
		return this.getDataValue('id');
	}

	get username(): string {
		return this.getDataValue('username');
	}

	get email(): string {
		return this.getDataValue('email');
	}

	get role(): string {
		return this.getDataValue('role');
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		role: {
			type: DataTypes.ENUM('user', 'admin', 'trainer'),
			allowNull: false,
			defaultValue: 'user'
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		timestamps: true,
		underscored: true // Use snake_case for column names
	}
);

export default User;