import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { GoalsModule } from './goals/goals.module';
import { RewardsModule } from './rewards/rewards.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    TasksModule,
    GoalsModule,
    RewardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
