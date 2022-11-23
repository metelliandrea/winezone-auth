import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(private readonly dataSource: DataSource) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const repo = await this.dataSource.getRepository(User);

      const user = await repo.findOne({
        where: { email: createUserDto.email },
      });

      if (user) {
        this.logger.error({ handler: 'create' }, 'Email already in use');
        throw new ConflictException('Email already in use');
      }

      const newUser = await repo.create(createUserDto);

      return repo.save(newUser);
    } catch (err) {
      this.logger.error({ handler: 'create' }, err.message);

      throw err;
    }
  }

  async findAll(): Promise<User[] | []> {
    return this.dataSource.getRepository(User).find();
  }

  async findOne(guid: string, otherConditions?: FindOneOptions) {
    try {
      const where = otherConditions ? { guid, ...otherConditions } : { guid };
      const user: User = await this.dataSource.getRepository(User).findOne({
        where,
      });

      if (!user) throw new NotFoundException('No User found');

      return user;
    } catch (err) {
      this.logger.error({ handler: 'findOne' }, err.message);

      throw err;
    }
  }

  async findOneBy(whereConditions: FindOneOptions, isAuth?: boolean) {
    try {
      const user: User = await this.dataSource
        .getRepository(User)
        .findOne(whereConditions);

      if (!user) {
        throw isAuth
          ? new UnauthorizedException(
              'You are not authorized to access this resouce',
            )
          : new NotFoundException('No User found');
      }

      return user;
    } catch (err) {
      this.logger.error({ handler: 'findOne' }, err.message);

      throw err;
    }
  }

  async update(guid: string, updateUserDto: UpdateUserDto) {
    try {
      const user: User = await this.dataSource
        .getRepository(User)
        .findOneBy({ guid });

      await this.dataSource.getRepository(User).update(
        { guid: guid },
        {
          ...user,
          ...updateUserDto,
        },
      );
    } catch (err) {
      this.logger.error({ handler: 'update' }, err.message);

      throw err;
    }
  }

  remove(guid: string) {
    return this.dataSource.getRepository(User).softDelete({ guid });
  }
}
