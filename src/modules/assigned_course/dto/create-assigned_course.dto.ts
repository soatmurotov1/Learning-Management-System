import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAssignedCourseDto {
    @ApiProperty({ example: "string"})
    @IsString()
    userId: string

    @ApiProperty({ example: "string"})
    @IsString()
    courseId: string
    
}
