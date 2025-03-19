import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';
import User from './User';


export interface PostAttributes {
  id: string;
  userId: string;
  content: string;
}

export type PostCreationAttributes = Omit<PostAttributes, 'id'>

class Post extends Model<PostAttributes, PostCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare content: string;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    underscored: true
  }
);

Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });

export default Post;