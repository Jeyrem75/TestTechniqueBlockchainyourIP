import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guide } from 'src/guides/entities/guide.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GuidesService } from 'src/guides/guides.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Guide, User])],
  controllers: [CoursesController],
  providers: [CoursesService, UsersService, GuidesService],
})
export class CoursesModule {}
