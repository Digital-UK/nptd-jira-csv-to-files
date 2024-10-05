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

    for await (const file of fileData) {
        console.log(file);
    }
}