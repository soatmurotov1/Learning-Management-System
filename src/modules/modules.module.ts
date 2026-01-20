import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HomeworkModule } from './homework/homework.module';
import { MentorProfileModule } from './mentor_profile/mentor_profile.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { CourseCategoryModule } from './course_category/course_category.module';
import { LessonGroupModule } from './lesson_group/lesson_group.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    HomeworkModule,
    MentorProfileModule,
    CourseModule,
    CourseCategoryModule,
    LessonGroupModule,
  ],
  providers: [JwtStrategy],
})
export class ModulesModule {}