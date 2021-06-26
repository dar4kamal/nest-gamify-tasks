import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { NotionModule } from 'src/notion/notion.module';
import { RewardsController } from './rewards.controller';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [NotionModule, ValidationModule],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
