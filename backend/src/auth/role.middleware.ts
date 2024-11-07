import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Logging request details for debugging
    console.log('Request method:', req.method); 
    console.log('Request URL:', req.url); 
    console.log('Request headers:', req.headers); 

    
    const authorizationHeader = req.headers.authorization;
    console.log('Authorization header:', authorizationHeader); 

    if (!authorizationHeader) {
      console.log('Unauthorized: No authorization header'); // Debugging statement
      return res.status(401).json({ message: 'Unauthorized: No authorization header' });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      console.log('Unauthorized: No token provided'); // Debugging statement
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    let payload;
    try {
      payload = this.jwtService.verify(token, { secret: 'secretKey' }); 
      console.log('Token payload:', payload); // Debugging statement
    } catch (err) {
      console.log('Invalid token:', err); // Debugging statement
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach payload to request object
    req.user = payload;
    console.log('User payload attached to request:', req.user); // Debugging statement

    // Role-based redirection
    if (payload.role === 'student') {
      console.log('Redirecting to student dashboard'); // Debugging statement
      return res.redirect('/student-dashboard');
    } else if (payload.role === 'teacher') {
      console.log('Redirecting to teacher dashboard'); // Debugging statement
      return res.redirect('/teacher-dashboard');
    } else {
      console.log('Forbidden: Invalid role'); // Debugging statement
      return res.status(403).json({ message: 'Forbidden: Invalid role' });
    }
  }
}
