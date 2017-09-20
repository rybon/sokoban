import 'styles/reset.css'
import 'styles/global.css'

import styles from './styles'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Selectors as TimeSelectors } from 'domains/time'
import {
  ActionCreators as RecorderActionCreators,
  Selectors as RecorderSelectors
} from 'domains/recorder'
import {
  ActionCreators as ReplayerActionCreators,
  Selectors as ReplayerSelectors
} from 'domains/replayer'
import { Button, Container, Message } from 'components/presentational'

const mapStateToProps = state => ({
  clock: TimeSelectors.clock(state),
  hasRecorder: RecorderSelectors.hasRecorder(state),
  isRecording: RecorderSelectors.isRecording(state),
  hasReplayer: ReplayerSelectors.hasReplayer(state),
  isReplaying: ReplayerSelectors.isReplaying(state)
})
const mapDispatchToProps = {
  startRecording: RecorderActionCreators.startRecording,
  stopRecording: RecorderActionCreators.stopRecording,
  startReplaying: ReplayerActionCreators.startReplaying,
  stopReplaying: ReplayerActionCreators.stopReplaying
}

class App extends Component {
  constructor(props) {
    super(props)
    this.startReplaying = this.startReplaying.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
  }

  startReplaying() {
    const recording = global.prompt('What recording needs to be replayed?')
    if (!recording) {
      return
    }
    const rawSession = global.confirm('Do you want to replay the raw session?')
    this.props.startReplaying(recording, rawSession)
  }

  stopRecording() {
    this.props.stopRecording(
      global.prompt('What should this recording be named?')
    )
  }

  render() {
    const {
      children,
      clock,
      hasRecorder,
      isRecording,
      startRecording,
      hasReplayer,
      isReplaying,
      stopReplaying
    } = this.props

    return (
      <Container className={styles.app}>
        {hasRecorder &&
          !isReplaying &&
          !isRecording && (
            <Button className={styles.recorderButton} onClick={startRecording}>
              {'Start recording'}
            </Button>
          )}
        {hasRecorder &&
          !isReplaying &&
          isRecording && (
            <Button
              className={styles.recorderButton}
              onClick={this.stopRecording}
            >
              {'Stop recording'}
            </Button>
          )}
        {hasReplayer &&
          !isRecording &&
          !isReplaying && (
            <Button
              className={styles.replayerButton}
              onClick={this.startReplaying}
            >
              {'Start replaying'}
            </Button>
          )}
        {hasReplayer &&
          !isRecording &&
          isReplaying && (
            <Button className={styles.replayerButton} onClick={stopReplaying}>
              {'Stop replaying'}
            </Button>
          )}
        <Message className={styles.topRight}>{clock}</Message>
        {children}
      </Container>
    )
  }
}

App.propTypes = {
  children: PropTypes.element,
  clock: PropTypes.string.isRequired,
  hasRecorder: PropTypes.any,
  isRecording: PropTypes.bool,
  hasReplayer: PropTypes.any,
  isReplaying: PropTypes.bool,
  startRecording: PropTypes.func.isRequired,
  stopRecording: PropTypes.func.isRequired,
  startReplaying: PropTypes.func.isRequired,
  stopReplaying: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
