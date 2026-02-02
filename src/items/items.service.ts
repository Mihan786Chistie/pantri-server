import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { LessThan, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) { }

  async create(userId: string, createItemDto: CreateItemDto) {
    return await this.itemsRepository.save({
      ...createItemDto,
      user: {
        id: userId,
      },
    });
  }

  async findAll(userId: string) {
    const items = await this.itemsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return items;
  }

  async findOne(userId: string, id: string) {
    const item = await this.itemsRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async update(userId: string, id: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    item.consumed = updateItemDto.consumed;
    return await this.itemsRepository.save(item);
  }

  async remove(userId: string, id: string) {
    const item = await this.itemsRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    const result = await this.itemsRepository.delete(item.id);
    if (result.affected === 0)
      throw new NotFoundException(`Item ${item.id} not found`);
    return { deleted: true };
  }

  async cleanupExpiredItems(userId: string) {
    const items = await this.itemsRepository.find({
      where: {
        user: {
          id: userId,
        },
        expiryDate: LessThan(new Date()),
      },
    });

    for (const item of items) {
      await this.itemsRepository.delete(item.id);
    }
  }
}
