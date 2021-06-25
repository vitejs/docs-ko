const path = require('path');
const fs = require('fs');
const formatter = require('./formatter');
const workspacePath = path.resolve(__dirname, '..', '..');

const h1MdRE = /^#\s+(.+)\s+(\{#([\w-]+)\})$/;
const articleDirs = ['blog', 'config', 'guide', 'plugins'];

const rewriteMdTitle = filePath => {
  const matter = formatter.open(filePath);
  const lines = matter.file.toString().split(/\r?\n/);
  const h1Line = lines.find(line => h1MdRE.test(line));

  if (h1Line === undefined) {
    return;
  }

  const title = h1MdRE.exec(h1Line)[1];
  matter.set('title', title).save();
}

const ergodicDirectory = dirPath =>
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.warn(`${dirPath} - Directory reading failed`);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(`${filePath} - File status reading failed`);
          return;
        }

        if (
          // rewrite files
          stats.isFile() &&
          filePath.split('.').pop().toLowerCase() === 'md'
        ) {
          rewriteMdTitle(filePath);
        } else if (
          // recursive find target file
          stats.isDirectory() &&
          articleDirs.includes(file)
        ) {
          ergodicDirectory(filePath);
        }
      });
    });
  });

ergodicDirectory(workspacePath);
