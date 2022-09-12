import { Injectable } from '@nestjs/common';
import { CreateStatusDTO, UpdateStatusDTO } from './dto';

@Injectable()
export class StatusService {
  create(createStatusDto: CreateStatusDTO) {
    return 'This action adds a new status';
  }

  findAll() {
    return `This action returns all status`;
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateStatusDto: UpdateStatusDTO) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
