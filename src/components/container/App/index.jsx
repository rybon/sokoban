// @flow

import 'styles/reset.css'
import 'styles/global.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clock } from 'domains/time/selectors'
import { startRecording, stopRecording } from 'domains/recorder/actionCreators'
import { hasRecorder, isRecording } from 'domains/recorder/selectors'
import { startReplaying, stopReplaying } from 'domains/replayer/actionCreators'
import { hasReplayer, isReplaying } from 'domains/replayer/selectors'
import { Button, Container, Message } from 'components/presentational'
import type { Node } from 'react'

import styles from './styles.css'

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

type Props = {
  children: Node,
  clock: string,
  hasRecorder: boolean,
  isRecording: boolean,
  hasReplayer: boolean,
  isReplaying: boolean,
  startRecording(): void,
  stopRecording(name: string): void,
  startReplaying(name: string, rawSession: boolean): void,
  stopReplaying(): void
}

class App extends Component<Props> {
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
    return (
      <Container className={styles.app}>
        {this.props.hasRecorder &&
          !this.props.isReplaying &&
          !this.props.isRecording && (
            <Button
              className={styles.recorderButton}
              onClick={this.props.startRecording}
            >
              {'Start recording'}
            </Button>
          )}
        {this.props.hasRecorder &&
          !this.props.isReplaying &&
          this.props.isRecording && (
            <Button
              className={styles.recorderButton}
              onClick={this.stopRecording}
            >
              {'Stop recording'}
            </Button>
          )}
        {this.props.hasReplayer &&
          !this.props.isRecording &&
          !this.props.isReplaying && (
            <Button
              className={styles.replayerButton}
              onClick={this.startReplaying}
            >
              {'Start replaying'}
            </Button>
          )}
        {this.props.hasReplayer &&
          !this.props.isRecording &&
          this.props.isReplaying && (
            <Button
              className={styles.replayerButton}
              onClick={this.props.stopReplaying}
            >
              {'Stop replaying'}
            </Button>
          )}
        <Message className={styles.topRight}>{this.props.clock}</Message>
        {this.props.children}
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
