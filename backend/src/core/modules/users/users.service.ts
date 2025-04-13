import bcrypt from "bcryptjs";
import { toDTO, User } from "../../../models";
import {
  UserCreationAttributes,
  UserUpdateAttributes,
  UserDTO,
} from "../../../models";
import { Op } from "sequelize";

export class UserService {
  /**
   * Get all users
   */
  static async getAll(): Promise<UserDTO[]> {
    const users = await User.findAll();
    return users.map((user) => toDTO(user));
  }

  static async getAllPaginated(
    page: number = 1,
    limit: number = 6
  ): Promise<{ users: UserDTO[]; total: number }> {
    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await User.findAndCountAll({
      where: {
        role: {
          [Op.ne]: "admin",
        },
      },
      limit,
      offset,
    });

    return {
      users: users.map((user) => toDTO(user)),
      total,
    };
  }

  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<UserDTO | null> {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) return null;
    return toDTO(user);
  }

  static async searchByEmail(
    query: string,
    page: number = 1,
    limit: number = 6
  ): Promise<{ users: UserDTO[]; total: number }> {
    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: `%${query}%` } },
          { username: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit,
      offset,
    });

    return {
      users: users.map((user) => toDTO(user)),
      total,
    };
  }

  /**
   * Get user by email
   */
  static async getByEmail(email: string): Promise<UserDTO | null> {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (!user) return null;
    return toDTO(user);
  }

  /**
   * Create a new user
   */
  static async create(userData: UserCreationAttributes): Promise<UserDTO> {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return toDTO(user);
  }

  /**
   * Update user
   */
  static async update(
    id: string,
    userData: UserUpdateAttributes
  ): Promise<UserDTO | null> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(userData);

    return toDTO(user);
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<boolean> {
    const deletedCount = await User.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
