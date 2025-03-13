import * as crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../../../core/db';
import { config } from '../../../config';
import { User, UserWithoutPassword } from '../users/users.interface';

export class AuthService {
  static async register(userData: Omit<User, 'id' | 'created_at'>): Promise<UserWithoutPassword> {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [userData.email]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Generate a UUID
    const userId = crypto.randomUUID();
    
    // Insert the new user
    const result = await db.query(
      `INSERT INTO users (id, name, email, password, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, role, created_at`,
      [userId, userData.name, userData.email, hashedPassword, userData.role || 'user']
    );
    
    return result.rows[0];
  }

  static async login(email: string, password: string) {
    // Find user by email
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = (jwt.sign as any)(
      { userId: user.id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
}