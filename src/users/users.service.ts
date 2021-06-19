import {
  getText,
  getDate,
  getTitle,
  getEmail,
  getNumber,
  getBoolean,
  getRollUpItem,
} from 'src/utils/getData';
import { User } from './users.model';
import { NotionService } from 'src/notion/notion.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  private notionService: NotionService = new NotionService();

  private getAllUsers = async () => {
    return await this.notionService.query(process.env.USERS_DB_ID);
  };
  private findUser = (user: any, email: string, password: string) =>
    getEmail(user.email) === email && getText(user.password) === password;

  private getUserDetails = async (
    email: string,
    password: string,
    isNew: boolean = false,
  ) => {
    const results = await this.getAllUsers();
    const usersData = results.map((user) => user.properties);

    const selectedUser: User = usersData.find((user) =>
      this.findUser(user, email, password),
    );
    const selectedUserIndex = usersData.findIndex((user) =>
      this.findUser(user, email, password),
    );

    if (isNew && selectedUser)
      throw new BadRequestException('User already exists ...');
    if (!selectedUser) throw new NotFoundException('User Not Found ...');
    return { selectedUser, userId: results[selectedUserIndex].id };
  };

  async getAll() {
    const results = await this.getAllUsers();

    const usersData = results.map((user) => user.properties);

    const output = usersData.map((user: User, index: number) => {
      return {
        id: results[index].id,
        name: getTitle(user.name),
        goals: user.goals.relation.map((goal, index) => {
          return {
            id: goal.id,
            name: getTitle(getRollUpItem(user, 'goalsName', index)),
            createdAt: getDate(getRollUpItem(user, 'goalsCreatedAt', index)),
            done: getBoolean(getRollUpItem(user, 'goalsDone', index)),
          };
        }),
        tasks: user.tasks.relation.map((task, index) => {
          return {
            id: task.id,
            name: getTitle(getRollUpItem(user, 'tasksName', index)),
            createdAt: getDate(getRollUpItem(user, 'tasksCreatedAt', index)),
            done: getBoolean(getRollUpItem(user, 'tasksDone', index)),
            points: getNumber(getRollUpItem(user, 'tasksPoint', index)),
          };
        }),
        rewards: user.rewards.relation.map((reward, index) => {
          return {
            id: reward.id,
            name: getTitle(getRollUpItem(user, 'rewardsName', index)),
            winAt: getDate(getRollUpItem(user, 'rewardWinAt', index)),
            points: getNumber(getRollUpItem(user, 'rewardsPoint', index)),
            achevied: getBoolean(getRollUpItem(user, 'rewardsAchevied', index)),
          };
        }),
        totalPoints: getNumber(user.totalPoints),
      };
    });
    return output;
  }

  async login(email: string, password: string) {
    const { selectedUser, userId } = await this.getUserDetails(email, password);

    const output = {
      id: userId,
      name: getTitle(selectedUser.name),
      goals: selectedUser.goals.relation.map((goal, index) => {
        return {
          id: goal.id,
          name: getTitle(getRollUpItem(selectedUser, 'goalsName', index)),
          createdAt: getDate(
            getRollUpItem(selectedUser, 'goalsCreatedAt', index),
          ),
          done: getBoolean(getRollUpItem(selectedUser, 'goalsDone', index)),
        };
      }),
      tasks: selectedUser.tasks.relation.map((task, index) => {
        return {
          id: task.id,
          name: getTitle(getRollUpItem(selectedUser, 'tasksName', index)),
          createdAt: getDate(
            getRollUpItem(selectedUser, 'tasksCreatedAt', index),
          ),
          done: getBoolean(getRollUpItem(selectedUser, 'tasksDone', index)),
          points: getNumber(getRollUpItem(selectedUser, 'tasksPoint', index)),
        };
      }),
      rewards: selectedUser.rewards.relation.map((reward, index) => {
        return {
          id: reward.id,
          name: getTitle(getRollUpItem(selectedUser, 'rewardsName', index)),
          winAt: getDate(getRollUpItem(selectedUser, 'rewardWinAt', index)),
          points: getNumber(getRollUpItem(selectedUser, 'rewardsPoint', index)),
          achevied: getBoolean(
            getRollUpItem(selectedUser, 'rewardsAchevied', index),
          ),
        };
      }),
      totalPoints: getNumber(selectedUser.totalPoints),
    };
    return output;
  }

  async register(name: string, email: string, password: string) {
    const { selectedUser, userId } = await this.getUserDetails(email, password);
  }
}
