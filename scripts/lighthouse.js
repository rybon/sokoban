const lighthouseRunner = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const { lighthouse } = require('../package.json')

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port // eslint-disable-line no-param-reassign
      return lighthouseRunner(url, opts, config).then(results => {
        // The gathered artifacts are typically removed as they can be quite large (~50MB+)
        delete results.artifacts // eslint-disable-line no-param-reassign
        return chrome.kill().then(() => results)
      })
    })
}

const opts = {}

// Usage:
launchChromeAndRunLighthouse('http://localhost:8080', opts).then(results => {
  const reportCategories = results.reportCategories.reduce((acc, val) => {
    acc[val.id] = val
    return acc
  }, {})
  Object.keys(lighthouse).forEach(category => {
    const score = Math.round(reportCategories[category].score)
    if (score < lighthouse[category]) {
      process.exitCode = 1
    }
    console.info(
      `Lighthouse: score of ${score} / 100 (expected at least ${
        lighthouse[category]
      }) for category ${category}.\n`
    )
  })
})
