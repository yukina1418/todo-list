import { PartialType } from '@nestjs/mapped-types';

export class CreateStatusDTO {}

export class UpdateStatusDTO extends PartialType(CreateStatusDTO) {}
