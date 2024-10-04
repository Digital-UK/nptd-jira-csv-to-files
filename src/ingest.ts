import type { Parser } from 'csv-parse';
import { parse } from 'csv-parse';

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
            // Do something with each 'chunk'
            this.#parser.write(chunk);
        }

        await promise;

        this.#parser.end();

        let record;

        while (record = this.#parser.read()) {
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
    #parser: Parser = parse({});
}