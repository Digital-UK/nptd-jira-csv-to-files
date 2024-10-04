import { CSVIngest } from './ingest';

console.log('Hello World!');
console.log(process.argv);

const csvIngest = new CSVIngest();

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

const records = csvIngest.ingest(filePath);

for await (const row of records) {
    console.log(`row`, row);
}