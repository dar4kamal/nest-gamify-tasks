import Relation from '../utils/Relation';

export interface Task {
  id?: string;
  doneAt?: Date;
  name?: string;
  done?: boolean;
  points?: number;
  createdAt?: Date;
  goals?: Relation;
  removed?: boolean;
}
