import { Course } from 'src/courses/entities/course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'guides' })
export class Guide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column()
  author: string;

  @Column({ type: 'float' })
  rating: number;

  @ManyToMany(() => Course, (course) => course.guides)
  @JoinTable()
  courses: Course[];
}
