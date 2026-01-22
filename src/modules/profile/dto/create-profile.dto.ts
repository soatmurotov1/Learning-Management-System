import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateProfileDto {
    @ApiProperty({ example: "string"})
    @IsString()
    fullName: string

    @ApiProperty({ example: "string"})
    image?: string
}
