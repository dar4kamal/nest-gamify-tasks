import { createFilter, Filter } from './filters';

export default (query: any): any => {
  let sortParams: any[] = [];
  let filters: Filter[] = [];
  Object.keys(query)?.forEach((queryItem) => {
    if (queryItem == 'sort') {
      query[queryItem].split(',').forEach((sort) => {
        const [property, direction] = sort.split(':');
        sortParams.push({ property, direction });
      });
    } else {
      const [type, condition, value] = query[queryItem].split(':');
      filters.push(createFilter({ name: queryItem, type, condition, value }));
    }
  });
  return { sortParams, filters };
};
