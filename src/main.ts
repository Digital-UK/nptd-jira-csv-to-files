import { ingest } from './ingest';
import { digest } from './digest';
import { transform } from './transform';

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

const records = ingest<RowData>(filePath);
const digestedRecords = digest(records, transform);

for await (const row of digestedRecords) {
    console.log(row);
}