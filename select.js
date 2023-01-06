import fs from 'fs'
import path from 'path'

const DEFAULT_OUT_DIR = './out'

const ERROR_LOG_COLOR = '\x1b[35m%s\x1b[0m'
const SUCCESS_LOG_COLOR = '\x1b[36m%s\x1b[0m'

const IN_FILE_ERROR = 'ERROR: In file is not valid. Check if the path is valid, and that the file is a .tsv file.'
const REVIWER_NAMES_ERROR = 'ERROR: Invalid number of reviewer names. Make sure you have at least one reviewer.'
const REV_PER_APP_ERROR = 'ERROR: Invalid number of reviewers per applicant. Make sure you have enough reviwers to meet your # of reviwers per application.'

const SUCCESS_MESSAGE = 'Success! Assignments written to\n\t'

var inFile
var outDir = DEFAULT_OUT_DIR
var reviewerNames = []
var reviewersPerApplicant

function main() {

    if (!setCommandLineArgs())
        return

    if (!validateCommandLineArgs())
        return

    const names = fs.readFileSync(inFile, 'utf8')
    const applicants = parseNamesTSV(names)
    const reviewers = generateReviewerData(applicants)
    const outputData = generateOutputData(reviewers, applicants)

    const writeTarg = writeOutputData(outputData)
    if (!writeTarg)
        return
    
    console.log(SUCCESS_LOG_COLOR, SUCCESS_MESSAGE + writeTarg)
}

function setCommandLineArgs() {
    let args = process.argv.slice(2)
	let argc = args.length
    let revNamesStarted = false
	for (let i = 0; i < argc; ++i) {
		let arg = args[i]
		let parg = args[i - 1]
        if (['--in_file', '--out_dir', '--rev_per_app', '--rev_names'].includes(arg)) {

        } else if (parg === "--in_file") {
			inFile = arg
		} else if (parg === "--out_dir") {
			outDir = arg
		} else if (parg === '--rev_per_app') {
            reviewersPerApplicant = parseInt(arg)
        } else if (parg === '--rev_names') {
            reviewerNames.push(arg)
            revNamesStarted = true
        } else if (revNamesStarted) {
            reviewerNames.push(arg)
        }
	}
	if (
        argc === 0 || 
        inFile === undefined ||
        reviewerNames.length == 0 ||
        reviewersPerApplicant === 0
    ) {
		console.log(
`Usage: node select.js options [...]

Where options include:

-------------------------------
Read From .tsv File
-----------------------------
--in_file <file>\t\tThe .tsv file to read from. Must be a .tsv file.
--out_dir <dir>\t\tThe directory to output Reiewer/Applicant data to. Defaults to ./out/.
--rev_per_app <num>\t\tThe number of reviewers per applicant.
--rev_names <strings>\t\tA space-delimited list of names of reviewers.
-----------------------------`
		)
		return false
	}

    return true
}

function validateCommandLineArgs() {

    // check if input file is valid
    const isTSV = path.extname(inFile)
    const fileExists = fs.existsSync(inFile)
    const isValidFile = isTSV && fileExists
    if (!isValidFile) console.log(ERROR_LOG_COLOR, IN_FILE_ERROR)

    // check if reviewer names are valid
    const validReviewerNames = reviewerNames.length > 0
    if (!validReviewerNames) console.log(ERROR_LOG_COLOR, REVIWER_NAMES_ERROR)

    // check if there are a avlid number of reviwers per applicant
    const validRevPerApp = reviewersPerApplicant <= reviewerNames.length    
    if (!validRevPerApp) console.log(ERROR_LOG_COLOR, REV_PER_APP_ERROR)

    return isValidFile && validReviewerNames && validRevPerApp
}

function parseNamesTSV(names) {
    const applicants = {}

    const data = names.split('\n')
    for (const row of data) {
        const [email, name, discord] = row.split('\t')
        applicants[email] = { name: name, discord: discord }
    }

    return applicants
}

function generateReviewerData(applicants) {
    const reviewers = reviewerNames.reduce((acc, curr) => (acc[curr] = [], acc), {})
    
    for (const email in applicants) {
        let reviewersSorted = Object.keys(reviewers).sort((a, b) => {
            return reviewers[a].length - reviewers[b].length
        })

        for (let i = 0; i < reviewersPerApplicant; ++i) {
            reviewers[reviewersSorted[i]].push(email)
        }
    }

    return reviewers
}

function generateOutputData(reviewers, applicants) {
    let applicantsPerReviewer = Math.max(...Object.keys(reviewers).map((k, v) => {
        return reviewers[k].length
    }))

    let outputData = Object.keys(reviewers).join('\t\t\t') + '\n'
    for (let i = 0; i < applicantsPerReviewer; ++i) {
        let applicantData = []
        for (const reviewer in reviewers) {
            let email = reviewers[reviewer][i]
            if (email) {
                applicantData.push(email)
                applicantData.push(applicants[email].name)
                applicantData.push(applicants[email].discord)
            }
        }
        outputData += applicantData.join('\t') + '\n'
    }

    return outputData
}

function writeOutputData(outputData) {
    try {
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir)

        const outFileName = path.basename(inFile, path.extname(inFile)) + '_Assigned_Applicants' + path.extname(inFile)
        const writeTarg = path.join(outDir, outFileName)
        fs.writeFileSync(writeTarg, outputData)

        return writeTarg
    } catch (e) {
        return 
    }
}

main()