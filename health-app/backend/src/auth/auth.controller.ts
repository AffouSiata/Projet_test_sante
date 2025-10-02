import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body(ZodValidationPipe) loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body(ZodValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}