import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow('REDIS_HOST'),
        port: configService.getOrThrow('REDIS_PORT'),
        password: configService.getOrThrow('REDIS_PASSWORD'),
        ttl: 60000
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
          password: configService.getOrThrow('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [{
        name: 'short',
        ttl: Number(configService.getOrThrow('SHORT_TTL')),
        limit: Number(configService.getOrThrow('SHORT_LIMIT')),
      },
      {
        name: 'medium',
        ttl: Number(configService.getOrThrow('MEDIUM_TTL')),
        limit: Number(configService.getOrThrow('MEDIUM_LIMIT')),
      },
      {
        name: 'long',
        ttl: Number(configService.getOrThrow('LONG_TTL')),
        limit: Number(configService.getOrThrow('LONG_LIMIT')),
      }]
    }),
    DatabaseModule,
    ItemsModule,
    UsersModule,
    AuthModule,
    AiModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
