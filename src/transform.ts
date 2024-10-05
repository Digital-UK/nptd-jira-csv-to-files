
export function *transform(data: RowData | unknown): Generator<[filePath: string, fileData: string] | undefined> {
    let parentPath = '';

    while (true) {
        const { ['Issue Type']: issueType } = data as RowData;
        const isSubTask = issueType === 'Sub-task';
        
        if (issueType === 'Story') {
            parentPath = (data as RowData)['Summary'];
        }

        if (isSubTask)  {
            const { 
                ['Labels']: { [0]: firstLabel },
                ['Fix Version']: fixVersion,
                ['File_Name']: fileName, 
                ['Description']: gherkinDefinition 
            } = data as RowData;
            const issueMarkerIndex = gherkinDefinition.indexOf('@NPTD');
            data = yield [`${parentPath}/${fixVersion}/${firstLabel}/${fileName}`, gherkinDefinition.slice(issueMarkerIndex)];
        } 
        else {
            data = yield;
        }
    }
}