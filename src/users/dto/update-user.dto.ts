import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  check_password: string;
}
