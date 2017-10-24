import 'styles/reset.css'
import 'styles/global.css'

import styles from './styles.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clock } from 'domains/time/selectors'
import { startRecording, stopRecording } from 'domains/recorder/actionCreators'
import { hasRecorder, isRecording } from 'domains/recorder/selectors'
import { startReplaying, stopReplaying } from 'domains/replayer/actionCreators'
import { hasReplayer, isReplaying } from 'domains/replayer/selectors'
import { Button, Container, Message } from 'components/presentational'

const mapStateToProps = state => ({
  clock: clock(state),
  hasRecorder: hasRecorder(state),
  isRecording: isRecording(state),
  hasReplayer: hasReplayer(state),
  isReplaying: isReplaying(state)
})

const mapDispatchToProps = {
  startRecording,
  stopRecording,
  startReplaying,
  stopReplaying
}

class App extends Component {
  static propTypes = {
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

  startReplaying = () => {
    const recording = global.prompt('What recording needs to be replayed?')
    if (!recording) {
      return
    }
    const rawSession = false // global.confirm('Do you want to replay the raw session?')
    this.props.startReplaying(recording, rawSession)
  }

  stopRecording = () => {
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
