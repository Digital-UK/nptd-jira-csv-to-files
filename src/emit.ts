import { parse } from "node:path";
import { unlink, mkdir } from "node:fs/promises";
import archiver from 'archiver';

export async function emit(filePath: string, fileData: AsyncGenerator<TransformedData | undefined>): Promise<void> {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
      
    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err: any) {
        if (err.code === 'ENOENT') {
            // log warning
            console.warn(err)
        } else {
            // throw error
            throw err;
        }
    });
  
    archive.on('error', function(err: any) {
        throw err;
    });

    const { dir } = parse(filePath);

    await mkdir(dir, { recursive: true });
    
    const file = Bun.file(filePath);
    const writer = file.writer();

    archive.on('data', (chunk: Buffer) => {
        writer.write(chunk);
    });

    archive.on('end', () => {
        writer.end();
    });

    console.log(`Creating: "${filePath}"`);

    try {
        for await (const file of fileData) {
            if (!file) {
                continue;
            }

            const [filePath, fileData] = file;
        
            console.log(`Adding: "${filePath}"`);

            archive.append(fileData, { name: filePath });
        }
    } 
    catch (error) {
        await unlink(filePath);
        
        throw error;
    }

    archive.finalize();

    console.log(`Completed: "${filePath}"`);
}