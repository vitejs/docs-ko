const splitter = (lines, re) => lines
  .reduce((acc, str) => {
    const len = acc.length;

    if (re.test(str)) {
      acc.push([str]);
    } else {
      acc[len - 1].push(str);
    }

    return acc;
  }, []);

module.exports = data => {
  const lines = data
    .split(/\r?\n/)
    .map(str => str.trim())
    .filter(str => str !== '');

  const splitInd = lines.findIndex(str => /^commit\s[a-z0-9]+$/.test(str));
  const diffLines = lines.slice(0, splitInd);
  const commitLines = lines.slice(splitInd);

  const diffs = splitter(diffLines, /^diff\s--git\s.+$/)
    .map(([cmd, ...msg]) => msg.slice(2).join('\n'));

  const commits = splitter(commitLines, /^commit\s[a-z0-9]+$/)
    .map(([commit, author, date, ...msg]) => ({
      hash: commit.split(' ')[1],
      msg: msg.join('\n'),
    }));

  return diffs.map((diff, ind) => ({ diff, ...commits[ind] }));
};
