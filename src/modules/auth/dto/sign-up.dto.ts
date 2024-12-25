import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'lamnguyen' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'Lam@123456789' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Please choose a stronger password: Minimum 8 digits, 1 number or 1 special character, 1 uppercase.',
  })
  password: string;

  @ApiProperty({ example: 'Lam' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Nguyen' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'lamtest1@yopmail.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(10)
  email: string;

  @ApiProperty({ example: 'Hanoi, Vietnam' })
  @IsString()
  address: string;

  @ApiProperty({ example: '0984444255' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number invalid.',
  })
  phoneNumber: string;
}
