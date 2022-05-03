import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { NumericTransformer } from '@shared/transformers/NumericTransformer'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

@Entity('rentals')
class Rental {
    @PrimaryColumn()
    id: string

    @ManyToOne(() => Car)
    @JoinColumn({ name: 'car_id' })
    car: Car

    @Column()
    car_id: string

    @Column()
    user_id: string

    @Column()
    start_date: Date

    @Column()
    end_date: Date

    @Column()
    expected_return_date: Date

    @Column('numeric', {
        precision: 5,
        scale: 2,
        transformer: new NumericTransformer()
    })
    total: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    constructor() {
        if (!this.id) {
            this.id = uuidV4()
        }
    }
}

export { Rental }
