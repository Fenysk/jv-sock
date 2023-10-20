import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MaxLength(20)
    readonly username: string;

    @IsNotEmpty()
    @MinLength(3)
    readonly password: string;
    
}