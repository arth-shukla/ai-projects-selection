# ACM AI Project Selection Script

## Summary
The purpose of this script is to take a number of applicants and assign then to a number of reviewers such that each applicant is reviewed at least a certain number of times. Note: each applicant can be assigned to a certain reviewer at most once.

E.g. 100 applicants split among 5 reviewers, where each applicant should be reviewed 3 times. This script will assign each reviewer 60 unique applicants to review, and each applicant will be given to 3 total reviewers.

## Requirements
1. [NodeJS](https://nodejs.org/en/download/)

## Usage
First, create a `.tsv` file where each row corresponds to an applicant. Each line must be in format `[email]\t[name]\t[discord]`.

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
Take the example [above](#summary). Let's say the 100 applicants' data are stored in `./files/applicant_names.tsv`.

The corresponding command would be the following:
```
node select.js --in_file ./files/applicant_names.tsv --rev_per_app 3 --rev_names name1 name2 name3 name4 name5
```

Optionally, one can set the output directory. Let's say we want to output directory to be `./output_files`&mdash;the command is as follows:
```
node select.js --in_file ./files/applicant_names.tsv --rev_per_app 3 --rev_names name1 name2 name3 name4 name5 --out_dir ./output_files
```

# About Me

Arth Shukla [Site](https://arth.website) | [GitHub](https://github.com/arth-shukla) | [LinkedIn](https://www.linkedin.com/in/arth-shukla/)
