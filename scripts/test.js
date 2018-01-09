const fs = require('fs')
const path = require('path')
// Package config
const { config } = require('../package')
// User config
const argv = require('minimist')(process.argv.slice(2))

const {
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  WAIT_MS_FOR_SERVER
} = require('./testing/constants')

const host = (argv && argv.host) || ''
const port = (argv && argv.port) || config.port || 80
const location = `http://${host || 'localhost'}:${port}`
const viewportWidth =
  (argv &&
    argv.viewportWidth &&
    !Number.isNaN(parseInt(argv.viewportWidth, 10)) &&
    parseInt(argv.viewportWidth, 10)) ||
  VIEWPORT_WIDTH
const viewportHeight =
  (argv &&
    argv.viewportHeight &&
    !Number.isNaN(parseInt(argv.viewportHeight, 10)) &&
    parseInt(argv.viewportHeight, 10)) ||
  VIEWPORT_HEIGHT
const waitMsForServer =
  (argv &&
    argv.waitMsForServer &&
    !Number.isNaN(parseInt(argv.waitMsForServer, 10)) &&
    parseInt(argv.waitMsForServer, 10)) ||
  WAIT_MS_FOR_SERVER
const testOrderingSeed =
  (argv &&
    argv.testOrderingSeed &&
    !Number.isNaN(parseFloat(argv.testOrderingSeed)) &&
    parseFloat(argv.testOrderingSeed)) ||
  Math.random()
const noRandomTestOrdering = (argv && argv.noRandomTestOrdering) || false
const updateScreenshots = (argv && argv.updateScreenshots) || false
let recording = (argv && argv.recording) || ''

console.log('Using the following settings:')
console.log(host ? `- host: ${host}` : '- host: localhost')
console.log(`- port: ${port}`)
console.log(`- location: ${location}`)
console.log(`- viewportWidth: ${viewportWidth}`)
console.log(`- viewportHeight: ${viewportHeight}`)
console.log(`- waitMsForServer: ${waitMsForServer}`)
console.log(`- testOrderingSeed: ${testOrderingSeed}`)
console.log(`- noRandomTestOrdering: ${noRandomTestOrdering}`)
console.log(`- updateScreenshots: ${updateScreenshots}`)
console.log(recording ? `- recording: ${recording}` : '')

// Helpers
const {
  shuffle,
  checkIfUrlExists,
  recordingsNotFound
} = require('./testing/helpers')

// Runner
const { startTests } = require('./testing/runner')

const recordingsPath = path.resolve(__dirname, '..', 'recordings')
if (!fs.existsSync(recordingsPath)) {
  fs.mkdirSync(recordingsPath)
}

const recordingsFolders = fs
  .readdirSync(recordingsPath)
  .filter(folder =>
    fs.statSync(path.resolve(recordingsPath, folder)).isDirectory()
  )
if (!recordingsFolders.length) {
  console.log('')
  console.log(`No recordings found in: ${recordingsPath}`)
  console.log('')
  process.exit(1)
}

if (recording && recording[0] === '[') {
  try {
    recording = JSON.parse(recording)
  } catch (e) {
    console.log(`Invalid array: ${recording}`)
    process.exit(1)
  }
}

let recordingsToTest = recordingsFolders

if (recording) {
  if (recording.constructor.name === 'Array') {
    recordingsToTest = recording
  } else {
    recordingsToTest = [recording]
  }
}

if (recordingsNotFound(recordingsToTest, recordingsPath)) {
  process.exit(1)
}

if (noRandomTestOrdering) {
  console.log('')
  console.log('No random test ordering!')
  console.log('')
} else {
  console.log('')
  console.log(`Shuffling test ordering using seed: ${testOrderingSeed}`)
  console.log('')
  recordingsToTest = shuffle(recordingsToTest, testOrderingSeed)
}
console.log('')
console.log('Running the following test ordering:')
recordingsToTest.forEach((value, index) =>
  console.log(`| ${index + 1} | ${value}`)
)
console.log('')

if (waitMsForServer) {
  console.log('')
  console.log(`Waiting ${waitMsForServer}ms for ${location} to be ready...`)
  console.log('')
  setTimeout(() => {
    checkIfUrlExists(host, port, location, () =>
      startTests({
        location,
        viewportWidth,
        viewportHeight,
        updateScreenshots,
        recordingsToTest
      })
    )
  }, waitMsForServer)
} else {
  checkIfUrlExists(host, port, location, () =>
    startTests({
      location,
      viewportWidth,
      viewportHeight,
      updateScreenshots,
      recordingsToTest
    })
  )
}
