import { Controller, Post, UseGuards, Body, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/create-user.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { response, Response } from 'express';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Register request received:', createUserDto); // Debugging statement
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    console.log('Login request received:', loginUserDto); // Debugging statement
    const user = await this.authService.validateUser(loginUserDto.username, loginUserDto.password);
    if (!user) {
      console.log('Unauthorized: Invalid credentials'); // Debugging statement
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('User authenticated successfully:', user); // Debugging statement
    const token = await this.authService.login(user);
    response.cookie('jwt', token.access_token, { httpOnly: true });
    
    const role = user.role;
    console.log('user role:', role);
    let redirectPath = '';

    if (role === 'student') {
      console.log('redirecting to student dashboard');
      redirectPath = '/user/student-dashboard';
    } else if (role === 'teacher') {
      redirectPath = '/user/teacher-dashboard';
    } else {
      return response.status(403).json({ message: 'Forbidden' });
    }
    return response.json({ access_token: token.access_token, redirect: redirectPath });
  }
}
