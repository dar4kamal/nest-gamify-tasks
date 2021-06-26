import Relation from '../utils/Relation';

export interface Goal {
  id?: string;
  doneAt?: Date;
  name?: string;
  done?: boolean;
  percent?: number;
  createdAt?: Date;
  tasks?: Relation;
  removed?: boolean;
}
