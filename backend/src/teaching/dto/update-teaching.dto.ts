import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingDto } from './create-teaching.dto';

export class UpdateTeachingDto extends PartialType(CreateTeachingDto) {}
