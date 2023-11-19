import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
  ) {}

  getAllCategories(user: User) {
    return this.categoriesRepo.findBy({ user });
  }

  async getCategory(id: string) {
    if (!id) {
      return null;
    }

    return this.categoriesRepo.findOneBy({ id });
  }

  createCategory(dto: CreateCategoryDto, currentUser: User) {
    const category = this.categoriesRepo.create({
      ...dto,
      user: currentUser,
    });

    return this.categoriesRepo.save(category);
  }

  saveCategory(dto: Category) {
    const category = this.categoriesRepo.create(dto);
    return this.categoriesRepo.save(category, {});
  }

  deleteCategory(category: Category) {
    return this.categoriesRepo.remove(category);
  }

  deleteAllCategories(user: User) {
    return this.categoriesRepo.delete({ user });
  }
}
