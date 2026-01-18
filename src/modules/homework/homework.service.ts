import { Injectable } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
  create(createHomeworkDto: CreateHomeworkDto, userId: number) {
    return 'This action adds a new homework';
  }

  findAll() {
    return `This action returns all homework`
  }

  findOne(id: number) {
    return `This action returns a #${id} homework`;
  }

  update(id: number, updateHomeworkDto: UpdateHomeworkDto, userId: number) {
    return `This action updates a #${id} homework`;
  }

  remove(id: number, userId: number) {
    return `This action removes a #${id} homework`;
  }
}
