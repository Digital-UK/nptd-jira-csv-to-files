import readmeText from '../README.md' with { type: 'text' };

const TERMINAL_RED = '\x1b[31m';
const TERMINAL_RESET = '\x1b[0m';

function argumentsContainHelp(args: string[]): boolean {
    return args.includes('-h') || args.includes('--help');
}

export async function handleHelp(csvPath: string, targetPath: string) {
    const helpRequested = argumentsContainHelp(process.argv);

    if (!csvPath || !targetPath || helpRequested) {
        const invalidArguments = !helpRequested;

        invalidArguments && console.log(`${TERMINAL_RED}Invalid arguments provided!${TERMINAL_RESET}\n`);

        console.log(readmeText);
        process.exit(invalidArguments ? 1 : 0);
    }
}