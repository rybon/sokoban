import { default as interaction } from 'domains/interaction/reducer'
import { default as time } from 'domains/time/reducer'
import { default as navigation } from 'domains/navigation/reducer'
import { default as level } from 'domains/level/reducer'
import { default as scores } from 'domains/scores/reducer'
import { default as recorder } from 'domains/recorder/reducer'
import { default as replayer } from 'domains/replayer/reducer'

const reducers = {
  interaction,
  time,
  navigation,
  level,
  scores,
  recorder,
  replayer
}

export default reducers
