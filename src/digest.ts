export async function *digest<T extends Record<any, any>>(data: AsyncGenerator<T>, transformer: DataTransformer<T>) {
    let transformerGenFun; 

    for await (const row of data) {
        let nextData;

        if (!transformerGenFun) {
            transformerGenFun = transformer(row);
        } else {
            nextData = row;
        }

        yield transformerGenFun.next(nextData).value;
    }
}