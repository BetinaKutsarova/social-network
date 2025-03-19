import bcrypt from 'bcryptjs';
import { User } from '../../../models';
import { UserAttributes, UserCreationAttributes, UserDTO } from '../../../models';

export class UserService {
    /**
     * Get all users
     */
    static async getAll(): Promise<UserDTO[]> {
        const users = await User.findAll();
        return users;
    }

    /**
     * Get user by ID
     */
    static async getById(id: string): Promise<UserDTO | null> {
        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ['password'] }
        });

        return user;
    }

    /**
     * Get user by email
     */
    // static async getByEmail(email: string): Promise<User | null> {
    //     return await User.findOne({ where: { email } });
    // }

    /**
     * Create a new user
     */
    static async create(userData: UserCreationAttributes): Promise<UserDTO> {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        return user;
    }

    /**
     * Update user
     */
    static async update(id: string, userData: Partial<UserAttributes>): Promise<UserDTO | null> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const user = await User.findByPk(id);
        if (!user) return null;

        await user.update(userData);

        return user;
    }

    /**
     * Delete user
     */
    static async delete(id: string): Promise<boolean> {
        const deletedCount = await User.destroy({ where: { id } });
        return deletedCount > 0;
    }
}