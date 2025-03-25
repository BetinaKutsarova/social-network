import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';
import User from './User';

export interface PetAttributes {
	id: string;
	userId: string;
	name: string;
	species: string;
	breed?: string;
	ageYears?: number;
	bio?: string;
	avatarUrl?: string;
}

export type PetCreationAttributes = Omit<PetAttributes, 'id' | 'userId'>;
export type PetUpdateAttributes = Partial<PetCreationAttributes>;

class Pet extends Model<PetAttributes, PetCreationAttributes> {
	declare id: string;
	declare userId: string;
	declare name: string;
	declare species: string;
	declare breed?: string;
	declare ageYears?: number;
	declare bio?: string;
	declare avatarUrl?: string;
}

Pet.init(
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
		name: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		species: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		breed: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		ageYears: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		bio: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		avatarUrl: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	},
	{
		sequelize,
		modelName: 'Pet',
		tableName: 'pets',
		timestamps: true,
		underscored: true
	}
);

Pet.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Pet, { foreignKey: 'userId', as: 'pets' });

export default Pet;

