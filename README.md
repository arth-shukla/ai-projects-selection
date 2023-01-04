# ACM AI Project Selection Script

## Summary
The purpose of the string is to take a number of applications, and assign then to a number of reviewers in such a way that each applicant is reviewed at least a certain number of times.

E.g. 100 applicants split among 5 reviewers, where each applicant should be reviewed 3 times. Each reviewer will receive 60 unique names to review, and each name will be given to 3 reviewers.

## Requirements
1. [NodeJS](https://nodejs.org/en/download/)

## Usage
```
Usage: node select.js options [...]

Where options include:

-------------------------------
Read From .tsv File
-----------------------------
--in_file <file>\t\tThe .tsv file to read from. Must be a .tsv file.
--out_dir <dir>\t\tThe directory to output Reiewer/Applicant data to. Defaults to ./out/.
--rev_per_app <num>\t\tThe number of reviewers per applicant.
--rev_names <strings>\t\tA space-delimited list of names of reviewers.
-----------------------------
```

### Example
Take the example [above](#summary). Let's say the 100 applicants' are stored in `./files/applicant_names.tsv`. Note: each line corresponds to one applicant, and each line must be in format `[email]\t[name]\t[discord]`.

The corresponding command would be the following:
```
node select.js --in_file ./files/applicant_names.tsv --rev_per_app 3 --rev_names name1 name2 name3 name4 name5
```

Optionally, one can set the output directory. Let's say we want to output to `./output_files`&mdash;the command is as follows:
```
node select.js --in_file ./files/applicant_names.tsv --rev_per_app 3 --rev_names name1 name2 name3 name4 name5 --out_dir ./output_files
```