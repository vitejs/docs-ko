const { simpleGit } = require('simple-git')
const { Octokit } = require('@octokit/rest')
const useCreateIssue = require('./useCreateIssue.js')

const VITE_GIT = 'https://github.com/vitejs/vite.git'

const git = simpleGit()
  .addConfig(
    'user.email',
    '41898282+github-actions[bot]@users.noreply.github.com'
  )
  .addConfig('user.name', 'github-actions[bot]')

const token = process.argv[2]
const octokit = new Octokit({ auth: token })
const createIssue = useCreateIssue(octokit)

;(async () => {
  await git.addRemote('vite', VITE_GIT)

  await git.fetch(['vite'])
  await git.fetch(['origin'])

  await git.checkout(['--track', 'origin/sync'])

  const { all: commitList, total } = await git.log([
    'sync..vite/main',
    '--',
    'docs'
  ])

  if (!total) {
    return
  }

  console.log(commitList)
  await Promise.all(commitList.map(createIssue))

  await git.pull('vite', 'main')
  await git.push('origin', '+sync')
  await git.checkout('main')
})()
