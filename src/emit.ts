export async function emit(filePath: string, fileData: AsyncGenerator<[string, string]>): Promise<void> {
    for await (const file of fileData) {
        console.log(file);
    }
}