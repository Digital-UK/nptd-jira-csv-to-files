import readmeText from '../README.md' with { type: 'text' };

function argumentsContainHelp(args: string[]): boolean {
    return args.includes('-h') || args.includes('--help');
}

export async function handleHelp(scriptArgs: string[]) {
    const helpRequested = argumentsContainHelp(scriptArgs);

    if (helpRequested || scriptArgs.length < 2) {
        const invalidArguments = !helpRequested;

        invalidArguments && console.error(`Invalid arguments provided!`), console.log(``);

        console.log(readmeText);
        process.exit(invalidArguments ? 1 : 0);
    }
}