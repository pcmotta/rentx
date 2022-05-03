
interface IValueTransformer<T> {
    to(value: T): T
    from(value: string): T
}
