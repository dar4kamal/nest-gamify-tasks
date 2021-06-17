const numberFilters = [
  'equals',
  'less_than',
  'greater_than',
  'less_than_or_equal_to',
  'greater_than_or_equal_to',
];
const textFilters = ['contains'];
const dateFilters = [
  'equals',
  'before',
  'after',
  'on_or_before',
  'on_or_after',
];
const booleanFilters = ['equals'];

export class Filter {
  public property: string;
  constructor(name: string, value: string, type: string, condition: string) {
    this.property = name;
    this[type] = {};
    switch (type) {
      case 'number':
        this[type][condition] = Number(value);
        break;
      case 'date':
        this[type][condition] = new Date(value);
        break;
      case 'checkbox':
        this[type][condition] = Boolean(value);
        break;
      default:
        this[type][condition] = value;
        break;
    }
  }
}

export const createFilter = ({ name, value, type, condition }): Filter => {
  return new Filter(name, value, type, condition);
};
