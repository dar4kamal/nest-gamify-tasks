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
}
