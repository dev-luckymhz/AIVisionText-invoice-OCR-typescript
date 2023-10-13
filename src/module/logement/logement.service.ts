import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, Brackets } from 'typeorm';
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
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<{
    logements: Logement[];
    currentPage: number;
    perPage: number;
    total: number;
  }> {
    const skip = (page - 1) * take;

    const query = this.logementRepository
      .createQueryBuilder('logement')
      .where(
        new Brackets((qb) => {
          qb.where('logement.name LIKE :keyword', {
            keyword: `%${keyword}%`,
          }).orWhere('logement.type LIKE :keyword', {
            keyword: `%${keyword}%`,
          });
        }),
      )
      .orderBy(`logement.${sortBy}`, sortOrder)
      .skip(skip)
      .take(take);

    const [logements, totalCount] = await query.getManyAndCount();

    return {
      logements,
      currentPage: page,
      perPage: take,
      total: totalCount,
    };
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
