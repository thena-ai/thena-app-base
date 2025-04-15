import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ExampleEntity } from "../entities/example.entity";

@Injectable()
export class ExampleRepository {
  constructor(
    @InjectRepository(ExampleEntity)
    private readonly repository: Repository<ExampleEntity>
  ) {}

  async create(data: Partial<ExampleEntity>): Promise<ExampleEntity> {
    const example = this.repository.create(data);
    return await this.repository.save(example);
  }

  async findAll(): Promise<ExampleEntity[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<ExampleEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<ExampleEntity>
  ): Promise<ExampleEntity> {
    const example = await this.findOne(id);
    if (!example) {
      throw new Error(`Example with ID ${id} not found`);
    }
    Object.assign(example, data);
    return await this.repository.save(example);
  }

  async remove(id: string): Promise<void> {
    const example = await this.findOne(id);
    if (!example) {
      throw new Error(`Example with ID ${id} not found`);
    }
    await this.repository.remove(example);
  }
}
