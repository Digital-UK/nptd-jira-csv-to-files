import { CSVIngest } from './ingest';
import { /* DataDigest */ digest } from './digest';

const csvIngest = new CSVIngest();
//const dataDigest = new DataDigest();

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

const records = csvIngest.ingest(filePath);
const digestedRecords = digest(records);
