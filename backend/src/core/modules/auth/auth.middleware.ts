import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { db } from '../../../core/db';

interface JwtPayload {
  userId: string;
}

export const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const authHeader = ctx.header.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Authorization header is missing or invalid' };
      return;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' from the header
    
    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // Check if the user exists
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'User not found' };
      return;
    }
    
    // Attach the user to the context for use in routes
    ctx.state.user = user;
    
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
};

export const adminMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.status = 403;
    ctx.body = { error: 'Access denied. Admin role required.' };
    return;
  }
  
  await next();
};