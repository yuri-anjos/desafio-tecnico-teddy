import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class UserDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
