import type { Parser } from 'csv-parse';
import { parse } from 'csv-parse';

export class CSVIngest {
    constructor() {
        console.log('CSVIngest constructor');

        this.#initParser();
    }

    async ingest(filePath: string) {
        console.log('Ingesting', filePath);
        const readStream = Bun.file(filePath).stream();

        for await (const chunk of readStream) {
            // Do something with each 'chunk'
            this.#parser.write(chunk);
        }
    }

    #initParser() {
        this.#parser = parse({});

        this.#parser.on('error', function(err){
            console.error(err.message);
            process.exit(1);
        });
        this.#parser.on('readable', () => {
            let record = this.#parser.read();
            let processor = this.#dataProcessor

            if (!processor) {
                console.warn('No data processor set');

                processor = (record) => {
                    console.log(record);
                };
            }

            while (record = this.#parser.read()) {
                processor(record);
            }
        });
    }

    get #dataProcessor() {
        return this.#dataProcessorExternal;
    }
    
    #dataProcessorExternal: ((date: any) => void) | undefined;
    #parser: Parser = parse({});
    

}