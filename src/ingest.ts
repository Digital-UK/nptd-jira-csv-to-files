import { parse } from 'csv-parse';

export async function *ingest<T>(filePath: string): AsyncGenerator<T> {
    const { promise, reject, resolve } = Promise.withResolvers();
    const readStream = Bun.file(filePath).stream();
    const parser = parse({
        columns: true,
        groupColumnsByName: true
    });

    parser.on('error', (err) => {
        reject(err); 
    });
    parser.on('readable', () => {
        resolve(); 
    });    

    for await (const chunk of readStream) {
        parser.write(chunk);
    }

    await promise;

    parser.end();

    let record;

    while (record = parser.read()) {
        yield record;
    }
}
