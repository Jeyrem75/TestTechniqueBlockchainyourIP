import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GuidesService } from './guides.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Course } from 'src/courses/entities/course.entity';

@Controller('api/guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createGuideDto: CreateGuideDto) {
    return this.guidesService.create(createGuideDto);
  }

  @Get()
  findAll() {
    return this.guidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(+id);
  }

  @Get(':id/courses')
  async findCoursesByGuideId(@Param('id') id: string): Promise<Course[]> {
    const guideId = parseInt(id, 10);
    return this.guidesService.findCoursesByGuideId(guideId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/download')
  async downloadGuide(@Param('id') id: number, @Res() res: Response) {
    try {
      const guide = await this.guidesService.findOne(id);
      if (!guide) {
        return res.status(404).json({ message: 'Guide not found' });
      }

      const guideContent = guide;

      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${guide.title}.txt`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(guideContent);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDto) {
    return this.guidesService.update(+id, updateGuideDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guidesService.remove(+id);
  }
}
