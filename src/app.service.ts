import { Injectable } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AppService {
  async sendSwaggerDocs(res: ExpressResponse) {
    res.redirect(302, 'http://34.64.104.166:3000/api-docs');
  }
}
