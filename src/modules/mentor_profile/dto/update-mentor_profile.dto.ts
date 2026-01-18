import { PartialType } from '@nestjs/swagger';
import { CreateMentorProfileDto } from './create-mentor_profile.dto';

export class UpdateMentorProfileDto extends PartialType(CreateMentorProfileDto) {}
