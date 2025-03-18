import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../../models';
import { UserAttributes, UserDTO } from '../../../models/User';
import { config } from '../../../config';
import { redisClient } from '../redis/redis.service';

export interface TokenResponse {
  id: string;
  token: string;
}

export class AuthService {
  static async register(userData: Omit<UserAttributes, 'id'>): Promise<UserDTO> {
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
    
    return user;
  }

  static async login(email: string, password: string): Promise<TokenResponse> {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userData = user.get({ plain: true });

    const isPasswordValid = await bcrypt.compare(password, userData.password);
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
      id: user.id,
      token: token
    };
  }

  static async logout(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as { exp: number };
      
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;
      
      if (expiresIn > 0) {
        await redisClient.set(`blacklist:${token}`, '1', {
          EX: expiresIn
        });
      }
    } catch (error) {
      console.error('Error invalidating token:', error);
      throw error;
    }
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      return !!isBlacklisted;
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      throw error;
    }
  }
}