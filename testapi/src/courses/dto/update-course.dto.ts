import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  instructor: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map((item) => item.id))
  guides: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map((item) => item.id))
  attendees: number[];
}
