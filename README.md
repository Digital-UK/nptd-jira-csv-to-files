# NPTD Jira Issues to Feature files

This little utility converts a CSV file exported fomr Jira and creates a zip file containing test cases arranged in folders according to their parent story.

Usage: 
bun convert <csv_path> <zip_path>

Help:
bun convert [-h, --help] (Displays this help message)

Notes:
You will be warned if the csv file cannot be found (or is empty) and the program will exit; however a malformed CSV file might end up in a malformed zip file.