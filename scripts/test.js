const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')

// Headless browser
const puppeteer = require('puppeteer') // eslint-disable-line import/no-extraneous-dependencies
// Testing
const pixelmatch = require('pixelmatch') // eslint-disable-line import/no-extraneous-dependencies
const { PNG } = require('pngjs') // eslint-disable-line import/no-extraneous-dependencies

// Package config
const { config } = require('../package')
// User config
const argv = require('minimist')(process.argv.slice(2)) // eslint-disable-line import/no-extraneous-dependencies

const host = (argv && argv.host) || ''
const port = (argv && argv.port) || config.port || 80
const location = `http://${host || 'localhost'}:${port}`
const viewportWidth =
  (argv &&
    argv.viewportWidth &&
    !Number.isNaN(parseInt(argv.viewportWidth, 10)) &&
    parseInt(argv.viewportWidth, 10)) ||
  1280
const viewportHeight =
  (argv &&
    argv.viewportHeight &&
    !Number.isNaN(parseInt(argv.viewportHeight, 10)) &&
    parseInt(argv.viewportHeight, 10)) ||
  720
const waitMsForServer =
  (argv &&
    argv.waitMsForServer &&
    !Number.isNaN(parseInt(argv.waitMsForServer, 10)) &&
    parseInt(argv.waitMsForServer, 10)) ||
  0
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

function shuffle(array) {
  const arrayReference = array
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(testOrderingSeed * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    arrayReference[currentIndex] = array[randomIndex]
    arrayReference[randomIndex] = temporaryValue
  }

  return array
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

const notFound = recordingsToTest.some(recordingToFind => {
  const notFoundRecording = !fs.existsSync(
    path.resolve(recordingsPath, recordingToFind, 'recording.json')
  )
  if (notFoundRecording) {
    console.log('') // eslint-disable-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `Recording not found: ${recordingToFind}, does not exist: ${path.resolve(
        recordingsPath,
        recordingToFind,
        'recording.json'
      )}`
    )
    console.log('') // eslint-disable-line no-console
  }
  return notFoundRecording
})
if (notFound) {
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
  recordingsToTest = shuffle(recordingsToTest)
}
console.log('') // eslint-disable-line no-console
console.log('Running the following test ordering:') // eslint-disable-line no-console
recordingsToTest.forEach((value, index) =>
  // eslint-disable-next-line no-console
  console.log(`| ${index + 1} | ${value}`)
)
console.log('') // eslint-disable-line no-console

async function dispatcher(dispatch, runScript, index) {
  const log = index !== undefined && index !== null ? `| ${index} | ` : ''
  console.log(`${log}Dispatching ${dispatch.type}`) // eslint-disable-line no-console
  await runScript(
    `window.__STORE__.dispatch(eval(${JSON.stringify(dispatch)}))`
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
      path.resolve(__dirname, '..', 'recordings', name, `${filename}.png`)
    )
  ) {
    const originalFile = fs.readFileSync(
      path.resolve(__dirname, '..', 'recordings', name, `${filename}.png`)
    )
    const pixelmatchOptions = {
      threshold: 0,
      includeAA: true
    }
    // console.log(originalFile.toString('base64') === comparisonFile.toString('base64') ? 'Match!' : 'Failed!'); // eslint-disable-line no-console
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
            path.resolve(
              __dirname,
              '..',
              'recordings',
              name,
              `${filename}_diff.png`
            )
          )
        ) {
          fs.unlinkSync(
            path.resolve(
              __dirname,
              '..',
              'recordings',
              name,
              `${filename}_diff.png`
            )
          )
        }
        if (
          fs.existsSync(
            path.resolve(
              __dirname,
              '..',
              'recordings',
              name,
              `${filename}_new.png`
            )
          )
        ) {
          fs.unlinkSync(
            path.resolve(
              __dirname,
              '..',
              'recordings',
              name,
              `${filename}_new.png`
            )
          )
        }
        fs.writeFileSync(
          path.resolve(__dirname, '..', 'recordings', name, `${filename}.png`),
          comparisonFile,
          'base64'
        )
        console.log('') // eslint-disable-line no-console
        console.log(`Recorded updated ${filename}.png baseline image.`) // eslint-disable-line no-console
        console.log('') // eslint-disable-line no-console
      } else {
        process.exitCode = 1
        fs.writeFileSync(
          path.resolve(
            __dirname,
            '..',
            'recordings',
            name,
            `${filename}_diff.png`
          ),
          PNG.sync.write(differenceFilePNG)
        )
        fs.writeFileSync(
          path.resolve(
            __dirname,
            '..',
            'recordings',
            name,
            `${filename}_new.png`
          ),
          comparisonFile,
          'base64'
        )
        console.log('') // eslint-disable-line no-console
        console.log('Failed!') // eslint-disable-line no-console
        console.log(`Found ${numberOfMismatchedPixels} mismatched pixels.`) // eslint-disable-line no-console
        console.log(`Recorded ${filename}_diff.png for investigation.`) // eslint-disable-line no-console
        // eslint-disable-next-line no-console
        console.log(
          `Recorded ${filename}_new.png for possible replacement of the ${filename}.png baseline image.`
        )
        console.log('') // eslint-disable-line no-console
      }
    } else {
      console.log('') // eslint-disable-line no-console
      console.log('Match!') // eslint-disable-line no-console
      console.log(`Found ${numberOfMismatchedPixels} mismatched pixels.`) // eslint-disable-line no-console
      // eslint-disable-next-line no-console
      console.log(
        `This screenshot still matches the ${filename}.png baseline image!`
      )
      console.log('') // eslint-disable-line no-console
      if (
        fs.existsSync(
          path.resolve(
            __dirname,
            '..',
            'recordings',
            name,
            `${filename}_diff.png`
          )
        )
      ) {
        fs.unlinkSync(
          path.resolve(
            __dirname,
            '..',
            'recordings',
            name,
            `${filename}_diff.png`
          )
        )
      }
      if (
        fs.existsSync(
          path.resolve(
            __dirname,
            '..',
            'recordings',
            name,
            `${filename}_new.png`
          )
        )
      ) {
        fs.unlinkSync(
          path.resolve(
            __dirname,
            '..',
            'recordings',
            name,
            `${filename}_new.png`
          )
        )
      }
    }
  } else {
    fs.writeFileSync(
      path.resolve(__dirname, '..', 'recordings', name, `${filename}.png`),
      comparisonFile,
      'base64'
    )
    console.log('') // eslint-disable-line no-console
    console.log(`Recorded ${filename}.png baseline image.`) // eslint-disable-line no-console
    console.log('') // eslint-disable-line no-console
  }
}

function checkIfUrlExists(callback) {
  const options = {
    method: 'HEAD',
    host,
    port,
    path: url.parse(location).pathname
  }
  http
    .request(options, response => {
      if (response.statusCode === 200) {
        callback()
      } else {
        console.log('') // eslint-disable-line no-console
        console.log(`No server found running at: ${location}`) // eslint-disable-line no-console
        console.log('') // eslint-disable-line no-console
        process.exitCode = 1
      }
    })
    .on('error', () => {
      console.log('') // eslint-disable-line no-console
      console.log(`No server found running at: ${location}`) // eslint-disable-line no-console
      console.log('') // eslint-disable-line no-console
      process.exitCode = 1
    })
    .end()
}

function recurseAndReplaceImageValues(object, imageKey, imageValue) {
  const objectReference = object
  if (objectReference.constructor.name === 'Array') {
    objectReference.forEach((entry, index) => {
      if (
        entry !== undefined &&
        entry !== null &&
        entry.constructor.name !== 'Array' &&
        entry.constructor.name !== 'Object' &&
        entry === imageKey
      ) {
        objectReference[index] = imageValue
      } else if (
        entry !== undefined &&
        entry !== null &&
        (entry.constructor.name === 'Array' ||
          entry.constructor.name === 'Object')
      ) {
        recurseAndReplaceImageValues(
          objectReference[index],
          imageKey,
          imageValue
        )
      }
    })
  } else if (objectReference.constructor.name === 'Object') {
    Object.keys(objectReference).forEach(key => {
      if (
        objectReference[key] !== undefined &&
        objectReference[key] !== null &&
        objectReference[key].constructor.name !== 'Array' &&
        objectReference[key].constructor.name !== 'Object' &&
        objectReference[key] === imageKey
      ) {
        objectReference[key] = imageValue
      } else if (
        objectReference[key] !== undefined &&
        objectReference[key] !== null &&
        (objectReference[key].constructor.name === 'Array' ||
          objectReference[key].constructor.name === 'Object')
      ) {
        recurseAndReplaceImageValues(objectReference[key], imageKey, imageValue)
      }
    })
  }
}

function preProcessRecording(recordingReference) {
  const imagesArray = Object.keys(recordingReference.images)
  imagesArray.forEach(image => {
    recurseAndReplaceImageValues(
      recordingReference.initialState,
      image,
      recordingReference.images[image]
    )
    recurseAndReplaceImageValues(
      recordingReference.dispatches,
      image,
      recordingReference.images[image]
    )
    recurseAndReplaceImageValues(
      recordingReference.xhrResponses,
      image,
      recordingReference.images[image]
    )
    recurseAndReplaceImageValues(
      recordingReference.wsResponses,
      image,
      recordingReference.images[image]
    )
    recurseAndReplaceImageValues(
      recordingReference.sseResponses,
      image,
      recordingReference.images[image]
    )
  })
}

async function runTest(name, runScript, captureScreenshot) {
  console.log('') // eslint-disable-line no-console
  console.log(`Visual regression testing started for recording: ${name}`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  const replayedRecording = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '..', 'recordings', name, 'recording.json')
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
  // eslint-disable-next-line no-restricted-syntax
  for (const dispatch of replayedRecording.dispatches) {
    const filenameIndex = `${index}`.padStart(padding, 0)
    // eslint-disable-next-line no-await-in-loop
    await dispatchAndTakeScreenshot(
      name,
      `dispatch_${filenameIndex}`,
      dispatch,
      runScript,
      captureScreenshot,
      index
    )
    index += 1
  }
  console.log('') // eslint-disable-line no-console
  console.log(`Visual regression testing completed for recording: ${name}`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
}

async function runTests(
  recordingsToTestReference,
  runScript,
  captureScreenshot
) {
  // eslint-disable-next-line no-restricted-syntax
  for (const recordingToTest of recordingsToTestReference) {
    // eslint-disable-next-line no-await-in-loop
    await runTest(recordingToTest, runScript, captureScreenshot)
  }
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
    console.log('') // eslint-disable-line no-console
    console.log('Visual regression testing has completed!') // eslint-disable-line no-console
    console.log('') // eslint-disable-line no-console
  })
  await page.goto(location)
}

function startTests() {
  console.log('') // eslint-disable-line no-console
  console.log('Starting visual regression testing...') // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  startTestingEnvironment()
}

if (waitMsForServer) {
  console.log('') // eslint-disable-line no-console
  console.log(`Waiting ${waitMsForServer}ms for ${location} to be ready...`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  setTimeout(() => {
    checkIfUrlExists(startTests)
  }, waitMsForServer)
} else {
  checkIfUrlExists(startTests)
}
