const fs = require('fs');
const splitCommit = require('./splitCommit');
const { Octokit } = require('@octokit/rest');

const syncFilePath = require('path').resolve(__dirname, '..', 'sync');
const pat = process.argv[2];

fs.readFile(syncFilePath, (err, file) => {
  if (err) {
    return console.error(err);
  }

  const octokit = new Octokit({ auth: pat });

  splitCommit(file.toString()).forEach(({ diff, hash, msg }) =>
    octokit.rest.issues.create({
      owner: 'vitejs-kr',
      repo: 'docs-next',
      title: `[SYNC] ${msg}`,
      body: [
        `${msg} ([${hash.slice(0, 7)}](https://github.com/vitejs/vite/commit/${hash}))`,
        '',
        '---',
        '',
        `${diff}`,
      ].join('\n'),
    }));
});
