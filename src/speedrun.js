import speedrunsLeastNumberOfBoxMoves from 'speedrunsLeastNumberOfBoxMoves'
import speedrunsLeastNumberOfPlayerMoves
  from 'speedrunsLeastNumberOfPlayerMoves'

export default function speedrun(store = {}) {
  let speedruns = speedrunsLeastNumberOfBoxMoves
  let speedrunBothSessions = false

  let startingLevel = 1
  let waitMsBetweenLevels = 1500
  let waitMsBetweenSteps = 0

  function steps(level = 0, step = 0, store = {}) {
    let interval = global.setInterval(() => {
      if (speedruns['' + level][step]) {
        store.dispatch(speedruns['' + level][step])
        step = step + 1
      } else {
        global.clearInterval(interval)
        if (level + 1 < 101) {
          store.dispatch({
            type: 'NEXT_LEVEL@Level'
          })
          global.setTimeout(() => {
            steps(level + 1, 0, store)
          }, waitMsBetweenLevels)
        } else {
          store.dispatch({
            type: 'NEXT_LEVEL@Level'
          })
          if (speedrunBothSessions) {
            speedrunBothSessions = false
            speedruns = speedrunsLeastNumberOfPlayerMoves
            global.setTimeout(() => {
              steps(1, 0, store)
            }, waitMsBetweenLevels)
          }
        }
      }
    }, waitMsBetweenSteps)
  }

  if (/type=box/.test(global.location.href)) {
    speedruns = speedrunsLeastNumberOfBoxMoves
  } else if (/type=player/.test(global.location.href)) {
    speedruns = speedrunsLeastNumberOfPlayerMoves
  } else if (/type=both/.test(global.location.href)) {
    speedrunBothSessions = true
  }

  if (/level=(\d+)/.test(global.location.href)) {
    startingLevel = parseInt(/level=(\d+)/.exec(global.location.href)[1])
    if (startingLevel < 1 || startingLevel > 100) {
      startingLevel = 1
    }
  }

  if (/levelInterval=(\d+)/.test(global.location.href)) {
    waitMsBetweenLevels = parseInt(
      /levelInterval=(\d+)/.exec(global.location.href)[1]
    )
    if (waitMsBetweenLevels < 1500 || waitMsBetweenLevels > 10000) {
      waitMsBetweenLevels = 1500
    }
  }

  if (/stepInterval=(\d+)/.test(global.location.href)) {
    waitMsBetweenSteps = parseInt(
      /stepInterval=(\d+)/.exec(global.location.href)[1]
    )
    if (waitMsBetweenSteps < 0 || waitMsBetweenSteps > 1000) {
      waitMsBetweenSteps = 0
    }
  }

  store.dispatch({
    type: 'JUMP_TO_LEVEL@Level',
    payload: {
      id: startingLevel
    }
  })
  global.setTimeout(() => {
    steps(startingLevel, 0, store)
  }, waitMsBetweenLevels)
}
