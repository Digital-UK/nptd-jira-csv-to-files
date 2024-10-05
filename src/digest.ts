type TransformerYieldValue<D extends Record<any, any>> = ReturnType<ReturnType<DataTransformer<D>>['next']>['value'];

export async function *digest<T extends Record<any, any>>(data: AsyncGenerator<T>, transformer: DataTransformer<T>): AsyncGenerator<TransformerYieldValue<D>> {
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