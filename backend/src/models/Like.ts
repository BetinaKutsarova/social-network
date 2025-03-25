import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';
import User from './User';
import Comment from './Comment';

export interface LikeAttributes {
  id: string;
  userId: string;
  commentId?: string;
}

export type LikeCreationAttributes = Omit<LikeAttributes, 'id'>

class Like extends Model<LikeAttributes, LikeCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare commentId?: string;
}

Like.init(
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
    commentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
);

Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Comment.hasMany(Like, { foreignKey: 'commentId', as: 'likes' });

export default Like;