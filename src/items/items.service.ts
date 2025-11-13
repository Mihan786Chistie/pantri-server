import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = new Item(createItemDto);
    return await this.itemsRepository.save(item);
  }

  async findAll() {
    const items = await this.itemsRepository.find();
    return items;
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    item.consumed = updateItemDto.consumed;
    return await this.itemsRepository.save(item);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Item ${id} not found`);
    return { deleted: true };
  }
}
