interface Id {
  id: string;
}
interface Relation {
  relation: Id[];
}

export interface Task {
  id?: string;
  name?: string;
  goals?: Relation;
  points?: number;
  done?: boolean;
  createdAt?: Date;
  doneAt?: Date;
}
