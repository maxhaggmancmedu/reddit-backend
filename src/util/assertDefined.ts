export function assertDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value == null) {
        throw Error('Expexted value to be defined, but got: ' + value)
    }
}