import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly userService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    try {
      const user: User = await this.userService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      user.password = undefined;
      return user;
    } catch (err) {
      this.logger.error({ handler: 'register' }, err.message);

      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(req: Request): Promise<void> {
    // TODO: HANDLE LOGOUT
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user: User = await this.userService.findOneBy(
        {
          where: { email },
        },
        true,
      );

      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!user || !isPasswordMatching)
        throw new UnauthorizedException(
          { handler: 'validateUser' },
          'Invalid username or password',
        );

      user.password = undefined;

      return user;
    } catch (err) {
      this.logger.error({ handler: 'validateUser' }, err.message);

      throw err;
    }
  }
}
