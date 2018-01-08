const fs = require('fs')
const path = require('path')
// Constants
const { INDENTATION } = require('./constants')
// Helpers
const { preProcessRecording, postProcessRecording } = require('./helpers')
// Recorder
const slug = require('slug') // eslint-disable-line
const recordingsPath = path.resolve(__dirname, '..', '..', 'recordings')
let __IS_RECORDING__ = false
let recording = {}
// Replayer
let __IS_REPLAYING__ = false
// Data
const { levels, getScores } = require('./data')

const getLevelByIdHandler = (request, response) => {
  setTimeout(() => {
    response.json(levels[request.params.id])
  }, 500)
}
const getScoresHandler = (request, response) => {
  setTimeout(() => {
    response.json(getScores())
  }, 500)
}
const postScoresHandler = (request, response) => {
  setTimeout(() => {
    fs.writeFileSync(
      path.resolve(__dirname, '..', '..', 'api', 'scores.json'),
      JSON.stringify(request.body, null, INDENTATION)
    )
    response.json({ status: 'Scores saved.' })
  }, 500)
}
const recorderHandler = ws => {
  ws.on('message', message => {
    const payload = JSON.parse(message)
    if (payload.startRecording) {
      __IS_RECORDING__ = true
      console.log('Started recording!') // eslint-disable-line no-console
      recording.initialState = payload.initialState
      recording.dispatches = []
      recording.keyPresses = []
      recording.xhrResponses = []
      recording.wsResponses = []
      recording.sseResponses = []
      recording.images = {}
    } else if (payload.stopRecording) {
      __IS_RECORDING__ = false
      if (!fs.existsSync(recordingsPath)) {
        fs.mkdirSync(recordingsPath)
      }
      const name = slug(payload.name || Date.now())
      recording.impurities = payload.impurities
      const recordingFolderPath = path.resolve(
        __dirname,
        '..',
        '..',
        'recordings',
        name
      )
      if (!fs.existsSync(recordingFolderPath)) {
        fs.mkdirSync(recordingFolderPath)
      }
      const recordingFilePath = path.resolve(
        __dirname,
        '..',
        '..',
        'recordings',
        name,
        'recording.json'
      )
      let updated = ''
      if (fs.existsSync(recordingFilePath)) {
        console.log(`Updating ${name}!`) // eslint-disable-line no-console
        const screenshots = fs
          .readdirSync(recordingFolderPath)
          .filter(file => /\.png$/.test(file))
        if (screenshots.length) {
          screenshots.forEach(screenshot =>
            fs.unlinkSync(path.resolve(recordingFolderPath, screenshot))
          )
          console.log('Removed old screenshots.') // eslint-disable-line no-console
        }
        updated = 'updated '
      }
      fs.writeFileSync(
        recordingFilePath,
        JSON.stringify(recording, null, INDENTATION)
      )
      recording = {}
      console.log(`Stopped recording, saved ${updated}${name}!`) // eslint-disable-line no-console
      postProcessRecording(name)
    } else if (
      payload.type &&
      (!payload.payload || (payload.payload && !payload.payload.code))
    ) {
      recording.dispatches.push(payload)
    } else if (payload.type && payload.payload && payload.payload.code) {
      recording.keyPresses.push(payload)
    }
  })
}
const replayerHandler = ws => {
  let name = ''
  let replayedRecording = {}
  let session = []
  let rawSession = false
  ws.on('message', message => {
    const payload = JSON.parse(message)
    if (payload.startReplaying) {
      if (
        payload.name &&
        fs.existsSync(
          path.resolve(__dirname, '..', '..', 'recordings', payload.name)
        )
      ) {
        console.log('Started replaying!') // eslint-disable-line no-console

        name = payload.name // eslint-disable-line prefer-destructuring
        replayedRecording = JSON.parse(
          fs.readFileSync(
            path.resolve(
              __dirname,
              '..',
              '..',
              'recordings',
              name,
              'recording.json'
            )
          )
        )

        preProcessRecording(replayedRecording)
        ws.send(
          JSON.stringify({
            initialState: replayedRecording.initialState,
            impurities: replayedRecording.impurities
          })
        )

        session = replayedRecording.dispatches

        rawSession = payload.rawSession // eslint-disable-line prefer-destructuring

        if (rawSession) {
          __IS_REPLAYING__ = true
          session = replayedRecording.keyPresses
        }
        if (session && session.length) {
          let index = 0
          const remoteDispatcher = () => {
            setTimeout(() => {
              if (session[index]) {
                ws.send(JSON.stringify(session[index]))
                index += 1
                remoteDispatcher()
              } else {
                ws.send(JSON.stringify({ done: true }))
              }
            }, 1000)
          }
          remoteDispatcher()
        }
      }
    } else if (payload.stopReplaying) {
      name = ''
      replayedRecording = {}
      session = []
      rawSession = false
      __IS_REPLAYING__ = false
      console.log('Stopped replaying!') // eslint-disable-line no-console
    }
  })
}
const proxyHandler = (request, response) => {
  if (/api/.test(request.url)) {
    const recordedResponse = {}
    let replayedResponse = {}

    if (__IS_REPLAYING__) {
      replayedResponse = recording.xhrResponses.shift()
    }

    response.oldWriteHead = response.writeHead
    response.writeHead = (statusCode, statusMessage, headers) => {
      let statusCodeReference = statusCode
      let statusMessageReference = statusMessage
      let headersReference = headers
      if (__IS_RECORDING__) {
        recordedResponse.headers = {
          statusCode,
          statusMessage,
          headers
        }
      } else if (__IS_REPLAYING__) {
        statusCodeReference = replayedResponse.headers.statusCode
        statusMessageReference = replayedResponse.headers.statusMessage
        headersReference = replayedResponse.headers.headers
      }
      response.oldWriteHead(
        statusCodeReference,
        statusMessageReference,
        headersReference
      )
    }

    response.oldWrite = response.write
    response.write = (data, encoding) => {
      let dataReference = data
      if (__IS_RECORDING__) {
        recordedResponse.body = JSON.parse(data.toString(encoding))
      } else if (__IS_REPLAYING__) {
        const body = JSON.stringify(replayedResponse.body)
        dataReference = Buffer.from(body, encoding)
      }
      response.oldWrite(dataReference)
    }
    response.on('finish', () => {
      if (__IS_RECORDING__) {
        recordedResponse.getHeaders = response.getHeaders()
        recordedResponse.__META__ = {
          timestamp: Date.now()
        }
        recording.xhrResponses.push(recordedResponse)
      }
    })
  }
  return false
}

module.exports = {
  getLevelByIdHandler,
  getScoresHandler,
  postScoresHandler,
  recorderHandler,
  replayerHandler,
  proxyHandler
}
