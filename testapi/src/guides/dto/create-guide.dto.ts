import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGuideDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
