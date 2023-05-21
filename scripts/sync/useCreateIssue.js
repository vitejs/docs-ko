module.exports =
  (octokit) =>
  ({ date, hash, message }) =>
    new Promise((resolve, reject) => {
      try {
        const slicedHash = hash.slice(0, 7)

        octokit.rest.issues.create({
          owner: 'vitejs',
          repo: 'docs-ko',
          title: `[SYNC] ${message}`,
          labels: ['sync'],
          body: `[${date}] ${message} ([Go to commit ${slicedHash}](https://github.com/vitejs/vite/commit/${hash}))`,
        })

        resolve()
      } catch (error) {
        console.error(
          'Failed to create GitHub Issues',
          { date, hash, message },
          error,
        )

        reject(error)
      }
    })
