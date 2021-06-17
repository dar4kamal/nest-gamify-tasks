interface Id {
  id: string;
}
interface Relation {
  relation: Id[];
}

export interface User {
  id?: string;
  name?: string;
  goals?: Relation;
  tasks?: Relation;
  rewards?: Relation;
  totalPoints?: number;
}
