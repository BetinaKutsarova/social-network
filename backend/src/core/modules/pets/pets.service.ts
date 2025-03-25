import { Pet, User } from '../../../models';
import { PetAttributes, PetCreationAttributes, PetUpdateAttributes } from '../../../models';

export class PetService {
	static async getAll(): Promise<PetAttributes[]> {
		const pets = await Pet.findAll({
			include: [{
				model: User,
				as: 'owner',
				attributes: ['id', 'username', 'email']
			}]
		});
		return pets;
	}

	static async getByUserId(userId: string): Promise<PetAttributes[]> {
		const pets = await Pet.findAll({
			where: { userId },
		});
	
		return pets;
	}

	static async getById(id: string): Promise<PetAttributes | null> {
		const pet = await Pet.findOne({
			where: { id },
			include: [{
				model: User,
				as: 'owner',
				attributes: ['id', 'username', 'email']
			}]
		})

		return pet;
	}

	static async create(petData: PetCreationAttributes): Promise<PetAttributes> {
		const pet = await Pet.create(petData);
		return pet;
	}

	static async update(id: string, petData: Partial<PetUpdateAttributes>): Promise<PetAttributes | null> {
		const pet = await Pet.findByPk(id);
		if (!pet) return null;

		await pet.update(petData);

		return this.getById(id);
	}

	static async delete(id: string): Promise<boolean> {
		const deletedCount = await Pet.destroy({ where: { id } });
		return deletedCount > 0;
	}
}