const fs = require('fs')
const path = require('path')

// Headless browser
const puppeteer = require('puppeteer') // eslint-disable-line import/no-extraneous-dependencies
// Testing
const pixelmatch = require('pixelmatch') // eslint-disable-line import/no-extraneous-dependencies
const { PNG } = require('pngjs') // eslint-disable-line import/no-extraneous-dependencies

// Helpers
const { preProcessRecording } = require('../server/helpers')

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
  index,
  options
) {
  await dispatcher(dispatch, runScript, index)
  const comparisonFile = await captureScreenshot()
  if (
    fs.existsSync(
      path.resolve(__dirname, '..', '..', 'recordings', name, `${filename}.png`)
    )
  ) {
    const originalFile = fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'recordings', name, `${filename}.png`)
    )
    const pixelmatchOptions = {
      threshold: 0,
      includeAA: true
    }
    // console.log(originalFile.toString('base64') === comparisonFile.toString('base64') ? 'Match!' : 'Failed!'); // eslint-disable-line no-console
    const originalFilePNG = PNG.sync.read(originalFile)
    const comparisonFilePNG = PNG.sync.read(comparisonFile)
    const differenceFilePNG = new PNG({
      width: options.viewportWidth,
      height: options.viewportHeight
    })
    const numberOfMismatchedPixels = pixelmatch(
      originalFilePNG.data,
      comparisonFilePNG.data,
      differenceFilePNG.data,
      options.viewportWidth,
      options.viewportHeight,
      pixelmatchOptions
    )

    if (numberOfMismatchedPixels > 0) {
      if (options.updateScreenshots) {
        if (
          fs.existsSync(
            path.resolve(
              __dirname,
              '..',
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
              '..',
              'recordings',
              name,
              `${filename}_new.png`
            )
          )
        }
        fs.writeFileSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            'recordings',
            name,
            `${filename}.png`
          ),
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
      path.resolve(
        __dirname,
        '..',
        '..',
        'recordings',
        name,
        `${filename}.png`
      ),
      comparisonFile,
      'base64'
    )
    console.log('') // eslint-disable-line no-console
    console.log(`Recorded ${filename}.png baseline image.`) // eslint-disable-line no-console
    console.log('') // eslint-disable-line no-console
  }
}

async function runTest(name, runScript, captureScreenshot, options) {
  console.log('') // eslint-disable-line no-console
  console.log(`Visual regression testing started for recording: ${name}`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  const replayedRecording = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'recordings', name, 'recording.json')
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
    captureScreenshot,
    null,
    options
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
      index,
      options
    )
    index += 1
  }
  console.log('') // eslint-disable-line no-console
  console.log(`Visual regression testing completed for recording: ${name}`) // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
}

async function runTests(runScript, captureScreenshot, options) {
  // eslint-disable-next-line no-restricted-syntax
  for (const recordingToTest of options.recordingsToTest) {
    // eslint-disable-next-line no-await-in-loop
    await runTest(recordingToTest, runScript, captureScreenshot, options)
  }
}

async function startTestingEnvironment(options) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: options.viewportWidth,
    height: options.viewportHeight
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
    await runScript("const css = document.createElement('style')")
    await runScript("css.type = 'text/css'")
    await runScript(
      "css.innerHTML = '* { -webkit-transition: none !important; transition: none !important; -webkit-animation: none !important; animation: none !important; }'"
    )
    await runScript('document.head.appendChild(css)')
    await runScript('window.__IS_HEADLESS_BROWSER__ = true')
    const startReplayingDispatch = {
      type: 'START_REPLAYING@Replayer',
      payload: {}
    }
    await dispatcher(startReplayingDispatch, runScript)
    await runTests(runScript, captureScreenshot, options)
    const stopReplayingDispatch = {
      type: 'STOP_REPLAYING@Replayer'
    }
    await dispatcher(stopReplayingDispatch, runScript)
    await done()
    console.log('') // eslint-disable-line no-console
    console.log('Visual regression testing has completed!') // eslint-disable-line no-console
    console.log('') // eslint-disable-line no-console
  })
  await page.goto(options.location)
}

function startTests(options = {}) {
  console.log('') // eslint-disable-line no-console
  console.log('Starting visual regression testing...') // eslint-disable-line no-console
  console.log('') // eslint-disable-line no-console
  startTestingEnvironment(options)
}

module.exports = {
  startTests
}
