const FILE_EXTENSION = '.feature';

function derivePathFromData(data: RowData, pathPrefix: string = '', pathSuffix: string = ''): string {
    const { 
        ['Labels']: { [0]: firstLabel },
        ['Fix Version']: fixVersion,
        ['File_Name']: fileName, 
    } = data;

    return `${pathPrefix}${fixVersion}/${firstLabel}/${fileName}${pathSuffix}`;
}

function extractDefintion(rawDefintion: string): string {
    // TODO: Imrpove this logic
    return rawDefintion.split('@NPTD').slice(1)[0];
}

export function *transform(data: RowData | unknown): Generator<[filePath: string, fileData: string] | undefined> {
    let parentPath = '';

    while (true) {
        const { ['Issue Type']: issueType } = data as RowData;
        const isSubTask = issueType === 'Sub-task';
        
        if (issueType === 'Story') {
            parentPath = `${(data as RowData)['Summary']}/`;
        }

        if (isSubTask)  {
            const { 
                ['Description']: description, 
            } = data as RowData;

            data = yield [derivePathFromData(data as RowData, parentPath, FILE_EXTENSION), extractDefintion(description)];
        } 
        else {
            data = yield;
        }
    }
}