import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { Logement } from './entities/logement.entity';

@Injectable()
export class LogementService {
  constructor(
    @InjectRepository(Logement)
    private readonly logementRepository: Repository<Logement>,
  ) {}

  async create(createLogementDto: CreateLogementDto): Promise<Logement> {
    const logement = this.logementRepository.create(createLogementDto);
    return await this.logementRepository.save(logement);
  }

  async findAll(
    keyword: string,
    page: number,
    take: number,
  ): Promise<Logement[]> {
    const options: FindManyOptions<Logement> = {
      where: keyword
        ? [{ name: Like(`%${keyword}%`) }, { type: Like(`%${keyword}%`) }]
        : {},
      skip: (page - 1) * take,
      take,
    };

    return await this.logementRepository.find(options);
  }

  async findOne(id: number): Promise<Logement> {
    return await this.logementRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateLogementDto: UpdateLogementDto,
  ): Promise<Logement> {
    await this.logementRepository.update(id, updateLogementDto);
    return await this.logementRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.logementRepository.delete(id);
  }
}
