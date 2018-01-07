const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')

const shuffle = (array, testOrderingSeed) => {
  const arrayReference = array
  let currentIndex = arrayReference.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(testOrderingSeed * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = arrayReference[currentIndex]
    arrayReference[currentIndex] = arrayReference[randomIndex]
    arrayReference[randomIndex] = temporaryValue
  }

  return arrayReference
}

const checkIfUrlExists = (host, port, location, callback) => {
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

const recordingsNotFound = (recordingsToTest, recordingsPath) => {
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
  return notFound
}

module.exports = {
  shuffle,
  checkIfUrlExists,
  recordingsNotFound
}
