import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../core/db';

// User attributes interface
export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'trainer';
}

// export type UserWithoutPassword = Omit<UserAttributes, 'password'>;

export type UserDTO = Omit<User, 'password'>;

// Attributes for user creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' > {}

// User model class definition
class User extends Model<UserAttributes, UserCreationAttributes> {
    get id(): string {
      return this.getDataValue('id');
    }
    
    get name(): string {
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