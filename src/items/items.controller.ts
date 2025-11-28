import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Req() req, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(req.user.id, createItemDto);
  }

  @Get()
  async findAll(@Req() req) {
    return this.itemsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(req.user.id, id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemsService.remove(req.user.id, id);
  }
}
