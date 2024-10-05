declare module '*.md' {
    const content: string;
    export default content;
}

type TransformedData = [filePath: string, fileData: string];
type DataTransformer<T extends Record<any, any>> = (data: D | undefined) => Generator<TransformedData | undefined, undefined, D | undefined>;

type DataKeys = 'Issue Key' | 'Issue Type' | 'File_Name' | 'Summary' | 'Labels' | 'Gherkin definition'; 
type IssueTypes = 'Epic' | 'Story' | 'Sub-task'; 

type RowData = {
    ['Issue Key']: string;
    ['Issue Type']: IssueTypes;
    ['File_Name']: string;
    ['Summary']: string;
    ['Fix Version']: string;
    ['Labels']: string;
    ['Description']: string;
};