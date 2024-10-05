import { handleHelp } from './help';
import { sanitize } from './sanitize';
import { ingest } from './ingest';
import { digest } from './digest';
import { transform } from './transform';
import { emit } from './emit';

const scriptArgs = process.argv.slice(2);

await handleHelp(scriptArgs);

const [filePath, targetFilePath] = scriptArgs;


try {
    const [fileToParse, emitPath] = await sanitize(filePath, targetFilePath);
    const records = await ingest<RowData>(fileToParse);
    const digestedRecords = digest(records, transform);
    
    await emit(emitPath, digestedRecords);
} 
catch (error) {
    console.error((error as Error).message ?? error);
    process.exit(1);
}
