#!/usr/bin/env node
/**
 * https://gist.github.com/turadg/4c11ef9ac1af7b41276d0acc4d4bf8c8
 * Flowtype understands Node (or Haste) imports but not Webpack.
 *
 * Many codebases have webpack set up like:
 * src/foo.js
 * src/components/Bar.jsx
 *
 * And then import them like `require('foo')` or `require/components/Bar.jsx`
 *
 * Flow doesn't understand this by default. A solution that used to work was to convince
 * it that `src` was a source of Node modules (https://github.com/facebook/flow/issues/382)
 *
 * In Flow 0.57 they introduced an optimization to "only check the files in
   node_modules/ which are direct or transitive dependencies of the non-
   node_modules code." (https://github.com/facebook/flow/blob/master/Changelog.md#0570)
  * Because the trick above made Flow think your app modules were another source of node_modules,
  * now the app source would not be focused either. You could see this in Flow logs by
  * almost all app files being omitted from the "focused" count.
  *
  * A working alternative is to explicitly define `module.name_mapper` directives for each
  * child of your root directory, to tell Flow how to resolve those files. (Thanks to
  * https://github.com/cdebotton/react-universal/commit/e57aadbcbd8be4e2031f308187392f44d02b44f9#commitcomment-19062820
  * for the idea.)
  *
  * This script generates the directives you need in [options] of your `.flowconfig`.
  *
  * Set ROOT_APP_DIR if yours is not src/.
 */

const fs = require('fs')
const path = require('path')

const ROOT_APP_DIR = 'src'

const files = fs.readdirSync(ROOT_APP_DIR)

const jsList = []
const dirList = []

// eslint-disable-next-line no-restricted-syntax
for (const filename of files) {
  const isDirectory = fs
    .statSync(path.join(ROOT_APP_DIR, filename))
    .isDirectory()
  if (isDirectory) {
    dirList.push(filename)
  } else {
    const moduleName = path.basename(filename, '.js')
    jsList.push(moduleName)
  }
}

// eslint-disable-next-line no-console
console.log('Copy this in your .flowconfig under [options]:\n')

const dirMatcher = dirList.join('\\|')
// eslint-disable-next-line no-console
console.log(
  `module.name_mapper='^\\(${dirMatcher}\\)\\/\\(.*\\)$' -> '<PROJECT_ROOT>/src/\\1/\\2'`
)

const jsMatcher = jsList.join('\\|')
// eslint-disable-next-line no-console
console.log(
  `module.name_mapper='^\\(${jsMatcher}\\)$' -> '<PROJECT_ROOT>/src/\\1'`
)
