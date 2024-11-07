import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    console.log('User found:', user); // Debugging statement
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    console.log('Invalid password'); // Debugging statement
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { username: user.username, sub: user.userID, role: user.role };
    console.log('Generating JWT token with payload:', payload); // Debugging statement
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any) {
    console.log('Registering user:', user); // Debugging statement
    return this.userService.createUser(user);
  }
}
