import interaction from 'domains/interaction/reducer'
import time from 'domains/time/reducer'
import navigation from 'domains/navigation/reducer'
import level from 'domains/level/reducer'
import scores from 'domains/scores/reducer'
import recorder from 'domains/recorder/reducer'
import replayer from 'domains/replayer/reducer'
import local from 'domains/local/reducer'

const reducers = {
  interaction,
  time,
  navigation,
  level,
  scores,
  recorder,
  replayer,
  local
}

export default reducers
