import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { User } from '../../../models';
import { AuthService } from './auth.service';

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
    console.log('Token extracted:', token.substring(0, 15) + '...');
    
    // Check if token is blacklisted
    const isBlacklisted = await AuthService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Token has been invalidated' } };
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    console.log('Token verified, userId:', decoded.userId);
    
   // Get the user from the database
   const user = await User.findByPk(decoded.userId);
    
   if (!user) {
     ctx.status = 401;
     ctx.body = { error: { message: 'Invalid token' } };
     return;
   }

   // Add the user to the context state
   ctx.state.user = user;
   
   await next();
 } catch (error) {
   ctx.status = 401;
   ctx.body = { error: { message: 'Invalid token' } };
 }
}