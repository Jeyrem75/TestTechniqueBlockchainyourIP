import { Transform } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsArray,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateCourseDto {
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
