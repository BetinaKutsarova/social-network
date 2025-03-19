import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../core/db';
import Post from './Post';

interface PostMediaAttributes {
	id: string;
	postId: string;
	mediaUrl: string;
}

interface PostMediaCreationAttributes extends Optional<PostMediaAttributes, 'id'> { }

class PostMedia extends Model<PostMediaAttributes, PostMediaCreationAttributes> {
	declare id: string;
	declare postId: string;
	declare mediaUrl: string;
}

PostMedia.init(
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
		mediaUrl: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
	},
	{
		sequelize,
		modelName: 'PostMedia',
		tableName: 'post_media',
		timestamps: true,
		updatedAt: false,
		underscored: true
	}
);

PostMedia.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Post.hasMany(PostMedia, { foreignKey: 'postId', as: 'media' });

export default PostMedia;