
export function *transform(data: RowData | unknown): Generator<[filePath: string, fileData: string] | undefined> {
    let parentPath = '';

    while (true) {
        const { ['Issue Type']: issueType } = data;
        const isSubTask = issueType === 'Sub-task';
        
        if (issueType === 'Story') {
            parentPath = data['Summary'];
        }

        if (isSubTask)  {
            const { 
                ['Labels']: labels,
                ['File_Name']: fileName, 
                ['Description']: gherkinDefinition 
            } = data as RowData;
            const issueMarkerIndex = gherkinDefinition.indexOf('@NPTD');
            data = yield [`${parentPath}/${labels}/${fileName}`, gherkinDefinition.slice(issueMarkerIndex)];
            //data = yield;
        } 
        else {
            data = yield;
        }
    }
}