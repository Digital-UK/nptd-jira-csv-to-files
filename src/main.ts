import { CSVIngest } from './ingest';
import { /* DataDigest */ digest } from './digest';
import { transform } from './transform';

const csvIngest = new CSVIngest<RowData>();
//const dataDigest = new DataDigest();

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

const records = await csvIngest.ingest(filePath);
const digestedRecords = digest(records, transform);
//const test = [...records];
console.log('test');
for await (const row of digestedRecords) {
    //const { 'Summary':  } = row;
    //const path = row['path'];
    //yield transformer(row);
    console.log(row);
    console.log('test bob!');
    //yield row;
}