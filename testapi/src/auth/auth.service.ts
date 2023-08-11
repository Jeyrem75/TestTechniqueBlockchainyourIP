import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      isAdmin: registerDto.isAdmin,
    });

    try {
      const savedUser = this.userRepository.save(user);
      return savedUser;
    } catch (err) {
      throw new Error('Something bad happened during the registration');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      const isAdmin = user.isAdmin;
      const userId = user.id;

      return { userId, accessToken, isAdmin };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
