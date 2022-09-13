import { applyDecorators, createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';

export interface ICurrentUser {
  id: string;
}

//eslint-disable-next-line @typescript-eslint/naming-convention
export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext): ICurrentUser => {
  const req = context.switchToHttp().getRequest();
  return req.user;
});

//eslint-disable-next-line @typescript-eslint/naming-convention
export const ApiOkaResponse = <DataDto extends Type<unknown>>(dataDto: DataDto): any => {
  return applyDecorators(ApiExtraModels(dataDto), ApiOkResponse({ description: 'aa' }));
};
