import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../core/db';

// User attributes interface
export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'moderator';
}

export type UserWithoutPassword = Omit<UserAttributes, 'password'>;

// Attributes for user creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' > {}

// User model class definition
class User extends Model<UserAttributes, UserCreationAttributes> {
    // public id!: string;
    // public name!: string;
    // public email!: string;
    // public password!: string;
    // public role!: 'user' | 'admin' | 'moderator';
    get id(): string {
      return this.getDataValue('id');
    }
    
    get name(): string {
      return this.getDataValue('name');
    }
    
    get email(): string {
        return this.getDataValue('email');
    }

    get role(): string {
        return this.getDataValue('role');
    }
    
    // Convert to safe JSON without password
    public toJSON(): UserWithoutPassword {
      const values = this.get({ plain: true });
      const { password, ...safeValues } = values;
      return safeValues as UserWithoutPassword;
    }
  }

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
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
      type: DataTypes.ENUM('user', 'admin', 'moderator'),
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