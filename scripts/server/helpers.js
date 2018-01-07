const fs = require('fs')
const path = require('path')
const download = require('download') // eslint-disable-line import/no-extraneous-dependencies
const { INDENTATION } = require('./constants')

const recurseAndReplaceImageValues = (object, imageKey, imageValue) => {
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

const recurseAndFindImages = (object, regexp, destination) => {
  const destinationReference = destination
  if (object.constructor.name === 'Array') {
    object.forEach((entry, index) => {
      if (
        entry !== undefined &&
        entry !== null &&
        entry.constructor.name !== 'Array' &&
        entry.constructor.name !== 'Object' &&
        regexp.test(entry)
      ) {
        destinationReference[entry] = true
      } else if (
        entry !== undefined &&
        entry !== null &&
        (entry.constructor.name === 'Array' ||
          entry.constructor.name === 'Object')
      ) {
        recurseAndFindImages(object[index], regexp, destinationReference)
      }
    })
  } else if (object.constructor.name === 'Object') {
    Object.keys(object).forEach(key => {
      if (
        object[key] !== undefined &&
        object[key] !== null &&
        object[key].constructor.name !== 'Array' &&
        object[key].constructor.name !== 'Object' &&
        regexp.test(object[key])
      ) {
        destinationReference[object[key]] = true
      } else if (
        object[key] !== undefined &&
        object[key] !== null &&
        (object[key].constructor.name === 'Array' ||
          object[key].constructor.name === 'Object')
      ) {
        recurseAndFindImages(object[key], regexp, destinationReference)
      }
    })
  }
}

const preProcessRecording = savedRecording => {
  const imagesArray = Object.keys(savedRecording.images)
  imagesArray.forEach(image => {
    recurseAndReplaceImageValues(
      savedRecording.initialState,
      image,
      savedRecording.images[image]
    )
    recurseAndReplaceImageValues(
      savedRecording.dispatches,
      image,
      savedRecording.images[image]
    )
    recurseAndReplaceImageValues(
      savedRecording.xhrResponses,
      image,
      savedRecording.images[image]
    )
    recurseAndReplaceImageValues(
      savedRecording.wsResponses,
      image,
      savedRecording.images[image]
    )
    recurseAndReplaceImageValues(
      savedRecording.sseResponses,
      image,
      savedRecording.images[image]
    )
  })
}

const postProcessRecording = async name => {
  const savedRecording = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'recordings', name, 'recording.json')
    )
  )
  const regexp = /^(http|\/).+(\.png|\.jpg)/
  recurseAndFindImages(
    savedRecording.initialState,
    regexp,
    savedRecording.images
  )
  recurseAndFindImages(savedRecording.dispatches, regexp, savedRecording.images)
  recurseAndFindImages(
    savedRecording.xhrResponses,
    regexp,
    savedRecording.images
  )
  recurseAndFindImages(
    savedRecording.wsResponses,
    regexp,
    savedRecording.images
  )
  recurseAndFindImages(
    savedRecording.sseResponses,
    regexp,
    savedRecording.images
  )
  let counter = 0
  const imagesArray = Object.keys(savedRecording.images)
  // eslint-disable-next-line no-restricted-syntax
  for (const image of imagesArray) {
    // eslint-disable-next-line no-await-in-loop
    const data = await download(image)
    if (/\.png/.test(image)) {
      savedRecording.images[image] = `data:image/png;base64,${data.toString(
        'base64'
      )}`
    } else if (/\.jpg/.test(image)) {
      savedRecording.images[image] = `data:image/jpg;base64,${data.toString(
        'base64'
      )}`
    }
    counter += 1
    if (counter === imagesArray.length) {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          '..',
          '..',
          'recordings',
          name,
          'recording.json'
        ),
        JSON.stringify(savedRecording, null, INDENTATION)
      )
      console.log('Added base64 images to recording!') // eslint-disable-line no-console
    }
  }
}

module.exports = {
  preProcessRecording,
  postProcessRecording
}
