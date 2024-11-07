import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader) return false;
        
        const token = authHeader.split(' ')[1];

        try {
            const payload = this.jwtService.verify(token, { secret: 'secretKey' });
            request.user = payload;
            return true;
        }
        catch (err) {
            return false;
        }
    }
}