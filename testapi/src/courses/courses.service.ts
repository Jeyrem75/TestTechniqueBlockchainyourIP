import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UsersService } from 'src/users/users.service';
import { GuidesService } from 'src/guides/guides.service';
import { classToPlain } from 'class-transformer';
import { CourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    private usersService: UsersService,
    private guidesService: GuidesService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    course.name = createCourseDto.name;
    course.date = createCourseDto.date;
    course.instructor = createCourseDto.instructor;

    const guideIds = createCourseDto.guides;
    const guides = await this.guidesService.findByIds(guideIds);
    course.guides = guides;

    const attendeeIds = createCourseDto.attendees;
    const attendees = await this.usersService.findByIds(attendeeIds);
    course.attendees = attendees;

    try {
      const savedCourse = await this.coursesRepository.save(course);
      return classToPlain(savedCourse);
    } catch (err) {
      throw new Error('Something bad happened during the creation');
    }
  }

  async reserveCourse(id: number, motivation: string, userId: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['guides', 'attendees'],
    });
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (!course.attendees.includes(user)) {
      course.attendees.push(user);
      await this.coursesRepository.save(course);
    } else {
      throw new ConflictException('User is already registered for this course');
    }
  }

  private mapToDto(course: Course): CourseDto {
    const dto = new CourseDto();
    dto.id = course.id;
    dto.name = course.name;
    dto.date = course.date;
    dto.instructor = course.instructor;
    dto.guides = course.guides.map((guide) => guide.id);
    dto.attendees = course.attendees.map((attendee) => attendee.id);
    return dto;
  }

  findAll(): Promise<CourseDto[]> {
    return this.coursesRepository
      .find({ relations: ['guides', 'attendees'] })
      .then((courses) => courses.map((course) => this.mapToDto(course)));
  }

  async findOne(id: number): Promise<CourseDto | null> {
    const course = await this.coursesRepository.findOneOrFail({
      where: { id },
      relations: ['guides', 'attendees'],
    });
    return this.mapToDto(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesRepository.findOneOrFail({
      where: { id },
      relations: ['guides', 'attendees'],
    });

    if (updateCourseDto.name) {
      course.name = updateCourseDto.name;
    }
    if (updateCourseDto.date) {
      course.date = updateCourseDto.date;
    }
    if (updateCourseDto.instructor) {
      course.instructor = updateCourseDto.instructor;
    }

    if (updateCourseDto.guides) {
      const guideIds = updateCourseDto.guides;
      const guides = await this.guidesService.findByIds(guideIds);
      course.guides = guides;
    }

    if (updateCourseDto.attendees) {
      const attendeeIds = updateCourseDto.attendees;
      const attendees = await this.usersService.findByIds(attendeeIds);
      course.attendees = attendees;
    }

    try {
      const updatedCourse = await this.coursesRepository.save(course);
      return classToPlain(updatedCourse);
    } catch (err) {
      throw new Error('Something bad happened during the update');
    }
  }

  async remove(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}
