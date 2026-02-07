import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { BullModule } from '@nestjs/bullmq';
import { ItemsConsumer } from './items.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Item]),
  BullModule.registerQueue({
    name: 'expired-items-cleanup',
  }),
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsConsumer],
  exports: [ItemsService, BullModule],
})
export class ItemsModule { }
