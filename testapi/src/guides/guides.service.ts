import { Injectable } from '@nestjs/common';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { Repository } from 'typeorm';
import { Guide } from './entities/guide.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class GuidesService {
  constructor(
    @InjectRepository(Guide)
    private guidesRepository: Repository<Guide>,
  ) {}

  async create(createGuideDto: CreateGuideDto) {
    const guide = this.guidesRepository.create(createGuideDto);

    try {
      const savedGuide = await this.guidesRepository.save(guide);
      return savedGuide;
    } catch (err) {
      throw new Error('Something bad happened during the creation');
    }
  }

  findAll(): Promise<Guide[]> {
    return this.guidesRepository.find();
  }

  findOne(id: number): Promise<Guide | null> {
    return this.guidesRepository.findOneBy({ id });
  }

  async findByIds(ids: number[]): Promise<Guide[]> {
    return this.guidesRepository.findByIds(ids);
  }

  async findCoursesByGuideId(id: number): Promise<Course[]> {
    const guide = await this.guidesRepository.findOne({
      where: { id },
      relations: ['courses'],
    });
    return guide.courses;
  }

  async update(id: number, updateGuideDto: UpdateGuideDto) {
    const guideToUpdate = await this.guidesRepository.findOneBy({ id });

    if (!guideToUpdate) {
      throw new Error('Guide not found. Can not update.');
    }

    Object.assign(guideToUpdate, updateGuideDto);

    try {
      const updatedGuide = await this.guidesRepository.save(guideToUpdate);
      return updatedGuide;
    } catch (err) {
      throw new Error('Something bad happened during the update');
    }
  }

  async remove(id: number): Promise<void> {
    await this.guidesRepository.delete(id);
  }
}
