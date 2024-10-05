import { ingest } from './ingest';
import { digest } from './digest';
import { transform } from './transform';
import { emit } from './emit';
import { handleHelp } from './help';

const filePath = process.argv[2];
const targetFilePath = process.argv[3];

await handleHelp(filePath, targetFilePath);

const records = ingest<RowData>(filePath);
const digestedRecords = digest(records, transform);

await emit(targetFilePath, digestedRecords);