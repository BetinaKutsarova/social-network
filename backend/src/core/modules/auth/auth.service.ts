import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../../models';
import { UserAttributes, UserWithoutPassword } from '../../../models/User';
import { config } from '../../../config';

export class AuthService {
  static async register(userData: Omit<UserAttributes, 'id'>): Promise<UserWithoutPassword> {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user'
    });
    
    return user.toJSON();
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userData = user.get({ plain: true });

    const isPasswordValid = await bcrypt.compare(password, userData.password); // cause user.password is undefined due to user.toJSON()
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = (jwt.sign as any)(
      { userId: user.id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      user: user.toJSON(), // Returns user without password
      token
    };
  }
}