export class DataDigest<T extends Record<any, any>> {
    constructor() {
        console.log('DataDigest constructor');
    }

    async digest(data: AsyncGenerator<T>) {
        console.log('Digesting data');
        for await (const row of data) {
            yield record;
        }
    }
}