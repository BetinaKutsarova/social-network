import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../core/db';

interface HashtagAttributes {
	id: string;
	name: string;
}

interface HashtagCreationAttributes extends Optional<HashtagAttributes, 'id'> { }

class Hashtag extends Model<HashtagAttributes, HashtagCreationAttributes> {
	declare id: string;
	declare name: string;
}

Hashtag.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true
		},
	},
	{
		sequelize,
		modelName: 'Hashtag',
		tableName: 'hashtags',
		timestamps: true,
		updatedAt: false,
		underscored: true
	}
);

export default Hashtag;