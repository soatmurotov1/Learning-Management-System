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
import { ProfileModule } from './profile/profile.module';
import { AssignedCourseModule } from './assigned_course/assigned_course.module';
import { LessonModule } from './lesson/lesson.module';
import { RatingModule } from './rating/rating.module';

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
    ProfileModule,
    AssignedCourseModule,
    LessonModule,
    RatingModule,
  ],
  providers: [JwtStrategy],
})
export class ModulesModule {}