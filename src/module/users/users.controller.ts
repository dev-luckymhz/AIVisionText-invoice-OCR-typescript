import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; // Import User DTOs
import { UpdateUserDto } from './dto/update-user.dto'; // Import User DTOs

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const user = await this.userService.findById(id);
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return user;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return user;
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
