import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 *
 * @description REST API Docs를 생성해주는 swagger의 유틸리티 함수입니다.
 *
 */
export function setUpSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('swagger')
    .setDescription('완성된 API 입니다.')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
