import type { BunFile } from "bun";

export async function sanitize(ingestPath: string, emitPath: string): Promise<[ingestFile: BunFile, emitPath: string]> {
    console.log(`Sanitizing: ${ingestPath} -> ${emitPath}`);

    const ingestFile = Bun.file(ingestPath);
    let errorMessage;

    if (!(await ingestFile.exists())) {
        errorMessage = `File not found: ${ingestPath}`;
    } 
    else if (ingestFile.size === 0) {
        errorMessage = `File is empty: ${ingestPath}`;
    }

    if (errorMessage) {
        throw new Error(errorMessage);
    }

    const emitPathHasExtension = emitPath.endsWith('.zip');
    const sanitizedEmitPath = emitPathHasExtension ? emitPath : `${emitPath}.zip`;
    
    emitPathHasExtension || console.warn(`Emit path does not have a '.zip' extension. Appending '.zip' to emit path: ${sanitizedEmitPath}`);

    return [ingestFile, sanitizedEmitPath];
}