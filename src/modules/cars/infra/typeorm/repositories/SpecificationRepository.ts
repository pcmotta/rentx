import { getRepository, Repository } from "typeorm";
import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import {
    ICreateSpecificationDTO,
    ISpecificationRepository
} from "@modules/cars/repositories/ISpecificationRepository";
import { AppError } from "@shared/errors/AppError";

class SpecificationRepository implements ISpecificationRepository {
    private repository: Repository<Specification>

    constructor() {
        this.repository = getRepository(Specification)
    }

    async create({ description, name }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = await this.repository.create({
            name,
            description
        })

        return await this.repository.save(specification)
    }

    async findByName(name: string): Promise<Specification> {
        const specification = this.repository.findOne({
            name
        })

        return specification
    }

    async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = await this.repository.findByIds(ids)

        return specifications
    }
}

export { SpecificationRepository }
