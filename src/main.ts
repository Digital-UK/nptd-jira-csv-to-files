import { CSVIngest } from './ingest';

console.log('Hello World!');
console.log(process.argv);

const csvIngest = new CSVIngest();

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

csvIngest.ingest(filePath);