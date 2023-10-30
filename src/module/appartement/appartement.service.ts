import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CreateApartmentDto } from './dto/create-appartement.dto';
import { UpdateApartmentDto } from './dto/update-appartement.dto';
import { Apartment } from './entities/appartement.entity';

@Injectable()
export class AppartementService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
  ) {}

  async create(createAppartementDto: CreateApartmentDto): Promise<Apartment> {
    const apartment = this.apartmentRepository.create(createAppartementDto);
    return await this.apartmentRepository.save(apartment);
  }

  async findAll(
    keyword: string,
    page: number,
    take: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<Apartment[]> {
    const skip = (page - 1) * take;

    const query = this.apartmentRepository
      .createQueryBuilder('apartment')
      .where(
        new Brackets((qb) => {
          qb.where('apartment.unitNumber LIKE :keyword', {
            keyword: `%${keyword}%`,
          }).orWhere('apartment.description LIKE :keyword', {
            keyword: `%${keyword}%`,
          });
        }),
      )
      .orderBy(`apartment.${sortBy}`, sortOrder)
      .skip(skip)
      .take(take);

    return await query.getMany();
  }

  async findOne(id: number): Promise<Apartment> {
    return await this.apartmentRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateAppartementDto: UpdateApartmentDto,
  ): Promise<Apartment> {
    await this.apartmentRepository.update(id, updateAppartementDto);
    return await this.apartmentRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.apartmentRepository.delete(id);
  }
}
