import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  sendSwaggerDocs(@Res() res: any): void {
    this.appService.sendSwaggerDocs(res);
  }
}
