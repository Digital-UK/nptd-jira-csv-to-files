
export function *transform(data: RowData): Generator<[filePath: string, fileData: string] | undefined> {
    console.log('Transforming data');
    //return transformer.transform(data);
/*     const { ['Issue Type']: issueType } = data;
    const isSubTask = issueType === 'Sub-task';
    let parentPath = '';
    
    if (issueType === 'Story') {
        parentPath = data['Summary'];
    }
 */
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
                ['Gherkin definition']: gherkinDefinition 
            } = data;
            const issueMarkerIndex = gherkinDefinition.indexOf('@NPTD');
            data = yield [`${parentPath}/${labels}/${fileName}`, gherkinDefinition.slice(issueMarkerIndex)];
            //data = yield;
        } 
        else {
            data = yield;
        }
        /* else { 
            data = yield;
        } */
       //data = yield;
    }
}