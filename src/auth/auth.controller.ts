import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  HttpCode,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/decorators/public.decorator';
import { RequiredRoles, Roles } from 'src/decorators/role.decorator';
import { LocalAuthenticationGuard } from 'src/guards/local.guard';
import { CheckUserRoles } from 'src/guards/role.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(CheckUserRoles)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  login(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('verify')
  verifyToken(@Req() req) {
    return plainToInstance(User, req.user);
  }

  @Get('logout')
  @RequiredRoles(Roles.ADMIN, Roles.STANDARD, Roles.PREMIUM)
  logout(@Req() req) {
    return this.authService.logout(req);
  }
}
