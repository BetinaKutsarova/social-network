import bcrypt from 'bcryptjs';
import { User } from '../../../models';
import { UserAttributes, UserWithoutPassword } from '../../../models';

export class UserService {
    /**
     * Get all users
     */
    static async getAll(): Promise<UserWithoutPassword[]> {
        const users = await User.findAll();
        return users.map(user => user.toJSON());
    }

    /**
     * Get user by ID
     */
    static async getById(id: string): Promise<UserWithoutPassword | null> {
        const user = await User.findByPk(id);
        return user ? user.toJSON() : null;
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
    static async create(userData: Omit<UserAttributes, 'id' | 'createdAt'>): Promise<UserWithoutPassword> {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        return user.toJSON();
    }

    /**
     * Update user
     */
    static async update(id: string, userData: Partial<UserAttributes>): Promise<UserWithoutPassword | null> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const user = await User.findByPk(id);
        if (!user) return null;

        await user.update(userData);

        return user.toJSON();
    }

    /**
     * Delete user
     */
    static async delete(id: string): Promise<boolean> {
        const deletedCount = await User.destroy({ where: { id } });
        return deletedCount > 0;
    }
}