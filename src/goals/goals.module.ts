import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { NotionModule } from 'src/notion/notion.module';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [NotionModule, ValidationModule],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
