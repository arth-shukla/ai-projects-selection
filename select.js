import fs from 'fs'

function main() {

    const filePath = './data/WI23'
    const reviewerNames = ['Arth', 'Jackie', 'Weiji', 'Vincent']
    const reviewersPerApplicant = 3

    const names = fs.readFileSync(filePath, 'utf8')
    const applicants = parseNamesTSV(names)
    const reviewers = generateReviewerData(reviewerNames, applicants, reviewersPerApplicant)
    const outputData = generateOutputData(reviewers)

    return outputData
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


function generateReviewerData(reviewerNames, applicants, reviewersPerApplicant) {
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
function generateOutputData(reviewers) {
    let applicantsPerReviewer = Math.max(...Object.keys(reviewers).map((k, v) => {
        return reviewers[k].length
    }))

    let outputData = Object.keys(reviewers).join('\t') + '\n'
    for (let i = 0; i < applicantsPerReviewer; ++i) {
        let emails = []
        for (const reviewer in reviewers) {
            let email = reviewers[reviewer][i] ?? ''
            emails.push(email)
        }
        outputData += emails.join('\t') + '\n'
    }

    return outputData
}

console.log(main())