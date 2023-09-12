import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto'; // Import User DTOs
import { UpdateUserDto } from '../dto/update-user.dto'; // Import User DTOs

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    try {
      return await this.userService.findByEmail(email);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    try {
      await this.userService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
