import type { Parser } from 'csv-parse';
import { parse } from 'csv-parse';
import { async } from './digest';

export class CSVIngest<T extends Record<any, any>> {
    constructor() {
        console.log('CSVIngest constructor');

        this.#readablePromiseAndResolvers = Promise.withResolvers();
        this.#initParser();
    }

    async *ingest(filePath: string): AsyncGenerator<T> {
        console.log('Ingesting', filePath);
        const readStream = Bun.file(filePath).stream();
        const { promise } = this.#readablePromiseAndResolvers;

        for await (const chunk of readStream) {
            this.#parser!.write(chunk);
        }

        await promise;

        this.#parser!.end();

        let record;

        while (record = this.#parser!.read()) {
            yield record;
        }
    }

    #initParser() {
        this.#parser = parse({
            columns: true,
        });

        this.#parser.on('error', (err) => {
            this.#readablePromiseAndResolvers.reject(err); 
        });
        this.#parser.on('readable', () => {
            this.#readablePromiseAndResolvers.resolve(); 
        });
    }
    
    #readablePromiseAndResolvers: ReturnType<typeof Promise.withResolvers>;
    #parser: Parser | undefined;
}

export async function *ingest<T>(filePath: string): AsyncGenerator<T> {
    const { promise, reject, resolve } = Promise.withResolvers();
    const readStream = Bun.file(filePath).stream();
    const parser = parse({
        columns: true,
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
