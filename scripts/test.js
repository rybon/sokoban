const fs = require('fs')
const path = require('path')

// Package config
const { config } = require('../package')
// User config
const argv = require('minimist')(process.argv.slice(2)) // eslint-disable-line import/no-extraneous-dependencies

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

console.log('Using the following settings:') // eslint-disable-line no-console
console.log(host ? `- host: ${host}` : '- host: localhost') // eslint-disable-line no-console
console.log(`- port: ${port}`) // eslint-disable-line no-console
console.log(`- location: ${location}`) // eslint-disable-line no-console
console.log(`- viewportWidth: ${viewportWidth}`) // eslint-disable-line no-console
console.log(`- viewportHeight: ${viewportHeight}`) // eslint-disable-line no-console
console.log(`- waitMsForServer: ${waitMsForServer}`) // eslint-disable-line no-console
console.log(`- testOrderingSeed: ${testOrderingSeed}`) // eslint-disable-line no-console
console.log(`- noRandomTestOrdering: ${noRandomTestOrdering}`) // eslint-disable-line no-console
console.log(`- updateScreenshots: ${updateScreenshots}`) // eslint-disable-line no-console
console.log(recording ? `- recording: ${recording}` : '') // eslint-disable-line no-console

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
  console.log('') // eslint-disable-line no-console
  console.log(`No recordings found in: ${recordingsPath}`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  process.exit(1)
}

if (recording && recording[0] === '[') {
  try {
    recording = JSON.parse(recording)
  } catch (e) {
    console.log(`Invalid array: ${recording}`) // eslint-disable-line no-console
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
  console.log('') // eslint-disable-line no-console
  console.log('No random test ordering!') // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
} else {
  console.log('') // eslint-disable-line no-console
  console.log(`Shuffling test ordering using seed: ${testOrderingSeed}`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  recordingsToTest = shuffle(recordingsToTest, testOrderingSeed)
}
console.log('') // eslint-disable-line no-console
console.log('Running the following test ordering:') // eslint-disable-line no-console
recordingsToTest.forEach((value, index) =>
  // eslint-disable-next-line no-console
  console.log(`| ${index + 1} | ${value}`)
)
console.log('') // eslint-disable-line no-console

if (waitMsForServer) {
  console.log('') // eslint-disable-line no-console
  console.log(`Waiting ${waitMsForServer}ms for ${location} to be ready...`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
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
