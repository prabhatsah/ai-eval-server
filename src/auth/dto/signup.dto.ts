import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum Role {
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
