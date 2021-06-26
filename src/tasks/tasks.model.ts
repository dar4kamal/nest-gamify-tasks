interface Id {
  id: string;
}
interface Relation {
  relation: Id[];
}

export interface Task {
  id?: string;
  doneAt?: Date;
  name?: string;
  done?: boolean;
  points?: number;
  createdAt?: Date;
  goals?: Relation;
}
