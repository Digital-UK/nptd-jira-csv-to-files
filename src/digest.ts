/* export class DataDigest<T extends Record<any, any>> {
    constructor() {
        console.log('DataDigest constructor');
    }

    async *digest(data: AsyncGenerator<T>) {
        console.log('Digesting data');
        for await (const row of data) {
            yield row;
        }
    }
} */

export async function *digest<T extends Record<any, any>>(data: AsyncGenerator<T>, transformer: DataTransformer<T>) {
    console.log('Digesting data');
    let transformerGenFun; // = transformer();
    for await (const row of data) {
        if (!transformerGenFun) {
            transformerGenFun = transformer(row);
            yield transformerGenFun.next();
        } else {
        //const { 'Summary':  } = row;
        //const path = row['path'];
        yield transformerGenFun.next(row);
        //console.log(row);
        //yield row;
        }
    }
}