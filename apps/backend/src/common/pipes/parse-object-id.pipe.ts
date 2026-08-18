import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string): Types.ObjectId {
    const valid = Types.ObjectId.isValid(value);
    if (!valid) {
      throw new BadRequestException(`ID "${value}" không đúng định dạng MongoDB ObjectId!`);
    }
    return new Types.ObjectId(value);
  }
}
