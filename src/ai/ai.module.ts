import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { CerebrasClient } from './cerebras.client';
import { Ai } from './entities/ai.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Item, Ai])],
  providers: [AiService, CerebrasClient],
  exports: [AiService]
})
export class AiModule { }
