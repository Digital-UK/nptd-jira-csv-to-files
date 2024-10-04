type DataTransformer<T extends Record<any, any>> = (data: T) => [filePath: string, fileData: string];

type DataKeys = 'Issue Key' | 'Issue Type' | 'File_Name' | 'Summary' | 'Labels' | 'Gherkin definition'; 
type IssueTypes = 'Epic' | 'Story' | 'Sub-task'; 

type RowData = {
    ['Issue Key']: string;
    ['Issue Type']: IssueTypes;
    ['File_Name']: string;
    ['Summary']: string;
    ['Labels']: string;
    ['Gherkin definition']: string;
};