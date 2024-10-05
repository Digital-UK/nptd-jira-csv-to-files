import type { BunFile } from 'bun';
import { parse } from 'csv-parse';

export async function *ingest<T>(file: BunFile): AsyncGenerator<T> {
    const { promise, reject, resolve } = Promise.withResolvers();

    const readStream = file.stream();
    const parser = parse({
        columns: true,
        groupColumnsByName: true
    });

    parser.on('error', (err) => {
        reject(err); 
    });
    parser.on('finish', () => {
        reject(`err`); 
    });
    parser.on('close', () => {
        reject(`err`); 
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
