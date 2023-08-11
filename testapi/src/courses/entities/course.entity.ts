import { Guide } from 'src/guides/entities/guide.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  instructor: string;

  @ManyToMany(() => Guide, (guide) => guide.courses)
  @JoinTable()
  guides: Guide[];

  @ManyToMany(() => User, (user) => user.courses)
  @JoinTable()
  attendees: User[];
}
