import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { User } from '../../../models';

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