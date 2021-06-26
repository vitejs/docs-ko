const { test } = require('@jest/globals');
const splitCommit = require('./splitCommit');

test('default test', () => {
  expect(splitCommit(`
      diff --git a/docs/docs-file b/docs/docs-file
      new file mode 100644
      index 0000000..cff7186
      --- /dev/null
      +++ b/docs/docs-file
      @@ -0,0 +1 @@
      +docs-file
      diff --git a/docs/docs-file-2 b/docs/docs-file-2
      new file mode 100644
      index 0000000..40691f5
      --- /dev/null
      +++ b/docs/docs-file-2
      @@ -0,0 +1 @@
      +docs-file-2
      commit 8458443518ca1a59b9a6c637520bcca178317679
      Author: shj <kan02134@gmail.com>
      Date:   Sat Jun 26 08:56:34 2021 +0900

          Create docs-file-2

      commit 1eb4be0b6ab84eec226ba52522b8f6bdbe633f05
      Author: shj <kan02134@gmail.com>
      Date:   Sat Jun 26 08:46:02 2021 +0900

      Create docs-file
      test
  `)).toEqual([
    {
      diff: 'new file mode 100644\n' +
        'index 0000000..cff7186\n' +
        '--- /dev/null\n' +
        '+++ b/docs/docs-file\n' +
        '@@ -0,0 +1 @@\n' +
        '+docs-file',
      hash: '8458443518ca1a59b9a6c637520bcca178317679',
      msg: 'Create docs-file-2'
    },
    {
      diff: 'new file mode 100644\n' +
        'index 0000000..40691f5\n' +
        '--- /dev/null\n' +
        '+++ b/docs/docs-file-2\n' +
        '@@ -0,0 +1 @@\n' +
        '+docs-file-2',
      hash: '1eb4be0b6ab84eec226ba52522b8f6bdbe633f05',
      msg: 'Create docs-file\ntest'
    }
  ]);
});
