import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';
import Post from './Post';
import Hashtag from './Hashtag';

class PostHashtag extends Model {
  declare postId: string;
  declare hashtagId: string;
}

PostHashtag.init(
  {
    postId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    hashtagId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'hashtags',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'PostHashtag',
    tableName: 'post_hashtags',
    timestamps: false,
    underscored: true
  }
);

Post.belongsToMany(Hashtag, { through: PostHashtag, foreignKey: 'postId', as: 'hashtags' });
Hashtag.belongsToMany(Post, { through: PostHashtag, foreignKey: 'hashtagId', as: 'posts' });

export default PostHashtag;