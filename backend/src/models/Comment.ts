import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';
import User from './User';
import Post from './Post';

export interface CommentAttributes {
  id: string;
  postId: string;
  userId: string;
  content: string;
}

export type CommentCreationAttributes = Omit<CommentAttributes, 'id'>
export type CommentUpdateAttributes = Partial<Omit<CommentAttributes, 'id' | 'postId' | 'userId'>>;

class Comment extends Model<CommentAttributes, CommentCreationAttributes> {
  declare id: string;
  declare postId: string;
  declare userId: string;
  declare content: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
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
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    underscored: true
  }
);

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE'});
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

export default Comment;