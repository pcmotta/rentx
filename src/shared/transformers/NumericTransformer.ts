import { ValueTransformer } from "typeorm";

export class NumericTransformer implements IValueTransformer<number> {
    to(value: number): number {
        return value
    }
    from(value: string): number {
        return parseFloat(value)
    }
}
