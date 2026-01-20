import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class RefreshToken {
    @ApiProperty({ example: "token"})
    @IsString()
    token: string

}