const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')

// Headless browser
const puppeteer = require('puppeteer')
// Testing
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG

// Package config
const config = require('./package').config
// User config
const argv = require('minimist')(process.argv.slice(2))
const host = (argv && argv.host) || ''
const port = (argv && argv.port) || config.port || 80
const location = 'http://' + (host || 'localhost') + ':' + port
const viewportWidth =
  (argv &&
    argv.viewportWidth &&
    !isNaN(parseInt(argv.viewportWidth, 10)) &&
    parseInt(argv.viewportWidth, 10)) ||
  1280
const viewportHeight =
  (argv &&
    argv.viewportHeight &&
    !isNaN(parseInt(argv.viewportHeight, 10)) &&
    parseInt(argv.viewportHeight, 10)) ||
  720
const waitMsForServer =
  (argv &&
    argv.waitMsForServer &&
    !isNaN(parseInt(argv.waitMsForServer, 10)) &&
    parseInt(argv.waitMsForServer, 10)) ||
  0
const testOrderingSeed =
  (argv &&
    argv.testOrderingSeed &&
    !isNaN(parseFloat(argv.testOrderingSeed)) &&
    parseFloat(argv.testOrderingSeed)) ||
  Math.random()
const noRandomTestOrdering = (argv && argv.noRandomTestOrdering) || false
const updateScreenshots = (argv && argv.updateScreenshots) || false
let recording = (argv && argv.recording) || ''

console.log('Using the following settings:')
console.log(host ? '- host: ' + host : '- host: localhost')
console.log('- port: ' + port)
console.log('- location: ' + location)
console.log('- viewportWidth: ' + viewportWidth)
console.log('- viewportHeight: ' + viewportHeight)
console.log('- waitMsForServer: ' + waitMsForServer)
console.log('- testOrderingSeed: ' + testOrderingSeed)
console.log('- noRandomTestOrdering: ' + noRandomTestOrdering)
console.log('- updateScreenshots: ' + updateScreenshots)
console.log(recording ? '- recording: ' + recording : '')

const recordingsPath = path.resolve(__dirname, 'recordings')
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
  console.log('No recordings found in: ' + recordingsPath)
  console.log('')
  process.exit(1)
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(testOrderingSeed * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

if (recording && recording[0] === '[') {
  try {
    recording = JSON.parse(recording)
  } catch (e) {
    console.log('Invalid array: ' + recording)
    process.exit(1)
  }
}

let recordingsToTest = recording
  ? recording.constructor.name === 'Array' ? recording : [recording]
  : recordingsFolders

const notFound = recordingsToTest.some(recordingToFind => {
  const notFoundRecording = !fs.existsSync(
    path.resolve(recordingsPath, recordingToFind, 'recording.json')
  )
  if (notFoundRecording) {
    console.log('')
    console.log(
      'Recording not found: ' +
        recordingToFind +
        ', does not exist: ' +
        path.resolve(recordingsPath, recordingToFind, 'recording.json')
    )
    console.log('')
  }
  return notFoundRecording
})
if (notFound) {
  process.exit(1)
}

if (noRandomTestOrdering) {
  console.log('')
  console.log('No random test ordering!')
  console.log('')
} else {
  console.log('')
  console.log('Shuffling test ordering using seed: ' + testOrderingSeed)
  console.log('')
  recordingsToTest = shuffle(recordingsToTest)
}
console.log('')
console.log('Running the following test ordering:')
recordingsToTest.forEach((value, index) =>
  console.log('| ' + (index + 1) + ' | ' + value)
)
console.log('')

function startTests() {
  console.log('')
  console.log('Starting visual regression testing...')
  console.log('')
  startTestingEnvironment()
}

function checkIfUrlExists(callback) {
  const options = {
    method: 'HEAD',
    host: host,
    port: port,
    path: url.parse(location).pathname
  }
  const request = http
    .request(options, response => {
      if (response.statusCode === 200) {
        callback()
      } else {
        console.log('')
        console.log('No server found running at: ' + location)
        console.log('')
        process.exitCode = 1
        return
      }
    })
    .on('error', () => {
      console.log('')
      console.log('No server found running at: ' + location)
      console.log('')
      process.exitCode = 1
      return
    })
    .end()
}

if (waitMsForServer) {
  console.log('')
  console.log(
    'Waiting ' + waitMsForServer + 'ms for ' + location + ' to be ready...'
  )
  console.log('')
  setTimeout(() => {
    checkIfUrlExists(startTests)
  }, waitMsForServer)
} else {
  checkIfUrlExists(startTests)
}

async function startTestingEnvironment() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: viewportWidth,
    height: viewportHeight
  })

  const runScript = script => page.evaluate(script)
  const captureScreenshot = () =>
    page.screenshot({
      fullPage: true,
      omitBackground: true
    })
  const done = () => browser.close()

  // Wait for window.onload before doing stuff.
  page.on('load', async () => {
    await runScript('window.__IS_HEADLESS_BROWSER__ = true')
    const startReplayingDispatch = {
      type: 'START_REPLAYING@Replayer',
      payload: {}
    }
    await dispatcher(startReplayingDispatch, runScript)
    await runTests(recordingsToTest, runScript, captureScreenshot)
    const stopReplayingDispatch = {
      type: 'STOP_REPLAYING@Replayer'
    }
    await dispatcher(stopReplayingDispatch, runScript)
    await done()
    console.log('')
    console.log('Visual regression testing has completed!')
    console.log('')
  })
  await page.goto(location)
}

async function runTests(recordingsToTest, runScript, captureScreenshot) {
  for (let recordingToTest of recordingsToTest) {
    await runTest(recordingToTest, runScript, captureScreenshot)
  }
}

function recurseAndReplaceImageValues(object, imageKey, imageValue) {
  if (object.constructor.name === 'Array') {
    object.forEach((entry, index) => {
      if (
        entry !== undefined &&
        entry !== null &&
        entry.constructor.name !== 'Array' &&
        entry.constructor.name !== 'Object' &&
        entry === imageKey
      ) {
        object[index] = imageValue
      } else if (
        entry !== undefined &&
        entry !== null &&
        (entry.constructor.name === 'Array' ||
          entry.constructor.name === 'Object')
      ) {
        recurseAndReplaceImageValues(object[index], imageKey, imageValue)
      }
    })
  } else if (object.constructor.name === 'Object') {
    Object.keys(object).forEach(key => {
      if (
        object[key] !== undefined &&
        object[key] !== null &&
        object[key].constructor.name !== 'Array' &&
        object[key].constructor.name !== 'Object' &&
        object[key] === imageKey
      ) {
        object[key] = imageValue
      } else if (
        object[key] !== undefined &&
        object[key] !== null &&
        (object[key].constructor.name === 'Array' ||
          object[key].constructor.name === 'Object')
      ) {
        recurseAndReplaceImageValues(object[key], imageKey, imageValue)
      }
    })
  }
}

function preProcessRecording(recording) {
  const imagesArray = Object.keys(recording.images)
  imagesArray.forEach(image => {
    recurseAndReplaceImageValues(
      recording.initialState,
      image,
      recording.images[image]
    )
    recurseAndReplaceImageValues(
      recording.dispatches,
      image,
      recording.images[image]
    )
    recurseAndReplaceImageValues(
      recording.xhrResponses,
      image,
      recording.images[image]
    )
    recurseAndReplaceImageValues(
      recording.wsResponses,
      image,
      recording.images[image]
    )
    recurseAndReplaceImageValues(
      recording.sseResponses,
      image,
      recording.images[image]
    )
  })
}

async function runTest(name, runScript, captureScreenshot) {
  console.log('')
  console.log('Visual regression testing started for recording: ' + name)
  console.log('')
  const replayedRecording = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, 'recordings', name, 'recording.json')
    )
  )
  preProcessRecording(replayedRecording)
  const initialStateDispatch = {
    type: 'SET_INITIAL_STATE@Replayer',
    payload: replayedRecording.initialState
  }
  await dispatchAndTakeScreenshot(
    name,
    'initialState',
    initialStateDispatch,
    runScript,
    captureScreenshot
  )
  let index = 0
  const padding = `${replayedRecording.dispatches.length}`.split('').length
  for (let dispatch of replayedRecording.dispatches) {
    const filenameIndex = `${index}`.padStart(padding, 0)
    await dispatchAndTakeScreenshot(
      name,
      `dispatch_${filenameIndex}`,
      dispatch,
      runScript,
      captureScreenshot,
      index
    )
    index = index + 1
  }
  console.log('')
  console.log('Visual regression testing completed for recording: ' + name)
  console.log('')
}

async function dispatcher(dispatch, runScript, index) {
  const log = index !== undefined && index !== null ? '| ' + index + ' | ' : ''
  console.log(log + 'Dispatching ' + dispatch.type)
  await runScript(
    'window.__STORE__.dispatch(eval(' + JSON.stringify(dispatch) + '))'
  )
}

async function dispatchAndTakeScreenshot(
  name,
  filename,
  dispatch,
  runScript,
  captureScreenshot,
  index
) {
  await dispatcher(dispatch, runScript, index)
  const comparisonFile = await captureScreenshot()
  if (
    fs.existsSync(
      path.resolve(__dirname, 'recordings', name, filename + '.png')
    )
  ) {
    const originalFile = fs.readFileSync(
      path.resolve(__dirname, 'recordings', name, filename + '.png')
    )
    let pixelmatchOptions = {
      threshold: 0,
      includeAA: true
    }
    // console.log(originalFile.toString('base64') === comparisonFile.toString('base64') ? 'Match!' : 'Failed!');
    const originalFilePNG = PNG.sync.read(originalFile)
    const comparisonFilePNG = PNG.sync.read(comparisonFile)
    const differenceFilePNG = new PNG({
      width: viewportWidth,
      height: viewportHeight
    })
    const numberOfMismatchedPixels = pixelmatch(
      originalFilePNG.data,
      comparisonFilePNG.data,
      differenceFilePNG.data,
      viewportWidth,
      viewportHeight,
      pixelmatchOptions
    )

    if (numberOfMismatchedPixels > 0) {
      if (updateScreenshots) {
        if (
          fs.existsSync(
            path.resolve(__dirname, 'recordings', name, filename + '_diff.png')
          )
        ) {
          fs.unlinkSync(
            path.resolve(__dirname, 'recordings', name, filename + '_diff.png')
          )
        }
        if (
          fs.existsSync(
            path.resolve(__dirname, 'recordings', name, filename + '_new.png')
          )
        ) {
          fs.unlinkSync(
            path.resolve(__dirname, 'recordings', name, filename + '_new.png')
          )
        }
        fs.writeFileSync(
          path.resolve(__dirname, 'recordings', name, filename + '.png'),
          comparisonFile,
          'base64'
        )
        console.log('')
        console.log('Recorded updated ' + filename + '.png baseline image.')
        console.log('')
      } else {
        process.exitCode = 1
        fs.writeFileSync(
          path.resolve(__dirname, 'recordings', name, filename + '_diff.png'),
          PNG.sync.write(differenceFilePNG)
        )
        fs.writeFileSync(
          path.resolve(__dirname, 'recordings', name, filename + '_new.png'),
          comparisonFile,
          'base64'
        )
        console.log('')
        console.log('Failed!')
        console.log('Found ' + numberOfMismatchedPixels + ' mismatched pixels.')
        console.log('Recorded ' + filename + '_diff.png for investigation.')
        console.log(
          'Recorded ' +
            filename +
            '_new.png for possible replacement of the ' +
            filename +
            '.png baseline image.'
        )
        console.log('')
      }
    } else {
      console.log('')
      console.log('Match!')
      console.log('Found ' + numberOfMismatchedPixels + ' mismatched pixels.')
      console.log(
        'This screenshot still matches the ' + filename + '.png baseline image!'
      )
      console.log('')
      if (
        fs.existsSync(
          path.resolve(__dirname, 'recordings', name, filename + '_diff.png')
        )
      ) {
        fs.unlinkSync(
          path.resolve(__dirname, 'recordings', name, filename + '_diff.png')
        )
      }
      if (
        fs.existsSync(
          path.resolve(__dirname, 'recordings', name, filename + '_new.png')
        )
      ) {
        fs.unlinkSync(
          path.resolve(__dirname, 'recordings', name, filename + '_new.png')
        )
      }
    }
  } else {
    fs.writeFileSync(
      path.resolve(__dirname, 'recordings', name, filename + '.png'),
      comparisonFile,
      'base64'
    )
    console.log('')
    console.log('Recorded ' + filename + '.png baseline image.')
    console.log('')
  }
}
