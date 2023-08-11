import { Expose } from 'class-transformer';

export class GetCourseDto {
  @Expose()
  name: string;

  @Expose()
  date: Date;

  @Expose()
  instructor: string;

  @Expose()
  guides: number[];

  @Expose()
  attendees: number[];
}
