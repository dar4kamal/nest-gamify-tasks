import { Injectable } from '@nestjs/common';
import Validation from './validation.model';
import GoalValidation from './goals.validation';
import TaskValidation from './tasks.validation';
import RewardValidation from './rewards.validation';

@Injectable()
export class ValidationService {
  public engine: Validation;
  setEngine(type: string) {
    switch (type) {
      case 'Task':
        this.engine = new TaskValidation();
        break;
      case 'Goal':
        this.engine = new GoalValidation();
        break;
      case 'Reward':
        this.engine = new RewardValidation();
        break;
      default:
        this.engine = null;
        break;
    }
  }
}
