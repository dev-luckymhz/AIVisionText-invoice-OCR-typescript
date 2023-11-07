// src/contracts/contract.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  async createContract(
    createContractDto: CreateContractDto,
  ): Promise<Contract> {
    const contract = this.contractRepository.create(createContractDto);
    return this.contractRepository.save(contract);
  }

  async findAllContracts(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
  ): Promise<[Contract[], number]> {
    const queryBuilder = this.contractRepository.createQueryBuilder('contract');

    if (searchTerm) {
      queryBuilder
        .where('contract.employerName LIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('contract.employeeName LIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
      // Add more search conditions if needed
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [contracts, total] = await queryBuilder.getManyAndCount();

    return [contracts, total];
  }

  async findOneContract(id: number): Promise<Contract> {
    return this.contractRepository.findOneOrFail({ where: { id } });
  }

  async updateContract(
    id: number,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    await this.contractRepository.update(id, updateContractDto);
    return this.findOneContract(id);
  }

  async deleteContract(id: number): Promise<void> {
    await this.contractRepository.delete(id);
  }
}
