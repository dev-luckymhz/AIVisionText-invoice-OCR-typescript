import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Import your User entity
import { CreateUserDto } from './dto/create-user.dto'; // Import User DTOs
import { UpdateUserDto } from './dto/update-user.dto'; // Import User DTOs

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by username: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }

      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.findById(id); // Check if the user exists

      await this.userRepository.update(id, updateUserDto);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.findById(id); // Check if the user exists

      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
