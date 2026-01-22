import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class ResetPassword {
    @ApiProperty({ example: "+998901112233"})
    @IsString()
    phone: string


    @ApiProperty({ example: "123123123"})
    @IsString()
    password: string

    @ApiProperty({  example: "000000"})
    @IsString()
    otp: string
    
}