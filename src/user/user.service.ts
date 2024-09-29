import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  findById(id: number): Promise<User> {
    this.logger.log('findById');
    return this.userRepository.findOne({ where: { id } });
  }

  create(user: User): Promise<User> {
    this.logger.log('create');
    user.id = undefined;
    return this.userRepository.save(user);
  }

  findByEmail(email: string): Promise<User> {
    this.logger.log('findByEmail');
    return this.userRepository.findOne({ where: { email } });
  }
}
