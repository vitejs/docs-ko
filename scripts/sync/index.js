const fs = require('fs');
const splitCommit = require('./splitCommit');
const { Octokit } = require('@octokit/rest');

const syncFilePath = require('path').resolve(__dirname, '..', '..', 'sync');
const token = process.argv[2];

fs.readFile(syncFilePath, (err, file) => {
  if (err) {
    return console.error(err);
  }

  const octokit = new Octokit({ auth: token });
  splitCommit(file.toString()).forEach(useCreateIssue(octokit));
});

const useCreateIssue =
  octokit =>
  ({ hash, msg }) =>
    octokit.rest.issues.create({
      owner: 'vitejs-kr',
      repo: 'vitejs-kr.github.io',
      title: `[SYNC] ${msg}`,
      labels: ['sync'],
      body: `${msg} ([Go to commit ${hash.slice(0, 7)}](https://github.com/vitejs/vite/commit/${hash}))`,
    });
