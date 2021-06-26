import { string, object } from 'joi';
import { Client } from '@notionhq/client';
import parseErrors from 'src/utils/parseErrors';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NotionService {
  private notion: Client;
  private notionIdRegex: RegExp = new RegExp(
    /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/,
  );
  private ErrorTypes: any = {
    OBJECT_NOT_FOUND: 'object_not_found',
  };
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

  checkId(id: string, name: string): void {
    const IdSchema = object({
      [`${name}`]: string().pattern(this.notionIdRegex).messages({
        'string.pattern.base':
          'must be in the pattern of xxxxxxxx(8)-xxxx(4)-xxxx(4)-xxxx(4)-xxxxxxxxxxxx(12)',
      }),
    });
    const { error } = IdSchema.validate(
      { [`${name}`]: id },
      { abortEarly: false },
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });
  }

  async checkPageExists(page_id: string, returns: boolean = true) {
    try {
      const page: any = await this.notion.pages.retrieve({
        page_id,
      });
      return returns ? page : true;
    } catch (error) {
      if (error.code === this.ErrorTypes.OBJECT_NOT_FOUND) {
        throw new Error('Page not found ...');
      }
    }
  }

  async checkParent(page_id: string, parentId: string) {
    const page: any = await this.checkPageExists(page_id);
    const isCorrectParent = page.parent.database_id == parentId;
    if (!isCorrectParent)
      throw new BadRequestException({
        input: 'pageId',
        message: 'Invalid Id',
      });
  }

  async update(page_id: string, props: any) {
    const results = await this.notion.pages.update({
      page_id,
      properties: props,
    });
    return results;
  }
}
