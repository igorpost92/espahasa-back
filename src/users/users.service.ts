import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  createUser(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create(createUserDto);
    return this.usersRepo.save(user);
  }

  async getUser(id: string) {
    if (!id) {
      return null;
    }

    const user = await this.usersRepo.findOneBy({ id });
    return user;
  }

  async findUserByName(name: string) {
    const user = await this.usersRepo.findOneBy({ name });
    return user;
  }
}
