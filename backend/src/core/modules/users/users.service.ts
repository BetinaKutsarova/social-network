import bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import { db } from '../../../core/db';
import { User, UserWithoutPassword } from './users.interface';

export class UserService {
  static async getAll(): Promise<UserWithoutPassword[]> {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users'
    );
    
    return result.rows;
  }

  static async getById(id: string): Promise<UserWithoutPassword | null> {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return null;
    
    return result.rows[0];
  }

  static async create(userData: Omit<User, 'id' | 'created_at'>): Promise<UserWithoutPassword> {
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

  static async update(id: string, userData: Partial<User>): Promise<UserWithoutPassword | null> {
    // Check if user exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) return null;
    
    // Create arrays to hold column names and values for dynamic query building
    const updateColumns: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    // Add each field to the update query if it exists in userData
    if (userData.name !== undefined) {
      updateColumns.push(`name = $${paramIndex}`);
      values.push(userData.name);
      paramIndex++;
    }
    
    if (userData.email !== undefined) {
      updateColumns.push(`email = $${paramIndex}`);
      values.push(userData.email);
      paramIndex++;
    }
    
    if (userData.role !== undefined) {
      updateColumns.push(`role = $${paramIndex}`);
      values.push(userData.role);
      paramIndex++;
    }
    
    if (userData.password !== undefined) {
      updateColumns.push(`password = $${paramIndex}`);
      values.push(await bcrypt.hash(userData.password, 10));
      paramIndex++;
    }
    
    // If no fields to update, return the existing user
    if (updateColumns.length === 0) {
      return {
        id: existingUser.rows[0].id,
        name: existingUser.rows[0].name,
        email: existingUser.rows[0].email,
        role: existingUser.rows[0].role,
        created_at: existingUser.rows[0].created_at
      };
    }
    
    // Add the ID to the values array
    values.push(id);
    
    // Execute the update query
    const result = await db.query(
      `UPDATE users 
       SET ${updateColumns.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING id, name, email, role, created_at`,
      values
    );
    
    return result.rows[0];
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rows.length > 0;
  }
}