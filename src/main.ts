import { CSVIngest } from './ingest';
import { DataDigest } from './digest';

console.log('Hello World!');
console.log(process.argv);

const csvIngest = new CSVIngest();
const dataDigest = new DataDigest();

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

const records = csvIngest.ingest(filePath);
const digestedRecords = dataDigest.digest(records);
