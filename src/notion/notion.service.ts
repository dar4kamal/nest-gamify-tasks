import { Client } from '@notionhq/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotionService {
  public notion: Client;
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  async query(DB_ID: string, filter: any = null, sort: any[] = []) {
    let queryOptions = {
      database_id: DB_ID,
    };
    if (filter) queryOptions['filter'] = filter;
    if (sort.length > 0) queryOptions['sort'] = sort;

    const { results } = await this.notion.databases.query(queryOptions);
    return results;
  }

  async create(DB_ID: string, props: any) {
    const results = await this.notion.pages.create({
      parent: { database_id: DB_ID },
      properties: props,
    });
    return results;
  }
}
