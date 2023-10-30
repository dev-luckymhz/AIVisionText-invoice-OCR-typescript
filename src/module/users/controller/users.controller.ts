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
  Query,
} from '@nestjs/common';
import { UserService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto'; // Import User DTOs
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('take') take: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC', // Default to ascending order
  ): Promise<User[]> {
    return this.userService.findAll(keyword, page, take, sortBy, sortOrder);
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
