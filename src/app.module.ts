import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { TasksController } from './tasks/tasks.controller';

import { GoalsModule } from './goals/goals.module';
import { GoalsService } from './goals/goals.service';
import { GoalsController } from './goals/goals.controller';

import { RewardsModule } from './rewards/rewards.module';
import { RewardsService } from './rewards/rewards.service';
import { RewardsController } from './rewards/rewards.controller';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TasksModule,
    GoalsModule,
    RewardsModule,
  ],
  controllers: [
    AppController,
    TasksController,
    RewardsController,
    GoalsController,
    UsersController,
  ],
  providers: [
    AppService,
    TasksService,
    RewardsService,
    GoalsService,
    UsersService,
  ],
})
export class AppModule {}
