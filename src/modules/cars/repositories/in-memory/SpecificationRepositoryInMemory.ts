import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ICreateSpecificationDTO, ISpecificationRepository } from "../ISpecificationRepository";

class SpecificationRepositoryInMemory implements ISpecificationRepository {
    specifications: Specification[] = []

    async create({ description, name }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = new Specification()

        Object.assign(specification, {
            name,
            description
        })

        this.specifications.push(specification)

        return specification
    }

    async findByName(name: string): Promise<Specification> {
        const specification = this.specifications.find(spec => name === spec.name)

        return specification
    }

    async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = this.specifications.filter(spec => ids.includes(spec.id))

        return specifications
    }
}

export { SpecificationRepositoryInMemory }
