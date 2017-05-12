import 'styles/reset.css';
import 'styles/global.css';

import styles from './styles';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Selectors as TimeSelectors
} from 'domains/time';
import {
    ActionCreators as RecorderActionCreators,
    Selectors as RecorderSelectors
} from 'domains/recorder';
import {
    ActionCreators as ReplayerActionCreators,
    Selectors as ReplayerSelectors
} from 'domains/replayer';
import {
    Button,
    Container,
    Message
} from 'components/presentational';

const mapStateToProps = (state) => ({
    clock: TimeSelectors.clock(state),
    hasRecorder: RecorderSelectors.hasRecorder(state),
    isRecording: RecorderSelectors.isRecording(state),
    hasReplayer: ReplayerSelectors.hasReplayer(state),
    isReplaying: ReplayerSelectors.isReplaying(state)
});
const mapDispatchToProps = {
    startRecording: RecorderActionCreators.startRecording,
    stopRecording: RecorderActionCreators.stopRecording,
    startReplaying: ReplayerActionCreators.startReplaying,
    stopReplaying: ReplayerActionCreators.stopReplaying
};

class App extends Component {
    constructor(props) {
        super(props);
        this.startReplaying = this.startReplaying.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }

    startReplaying() {
        this.props.startReplaying(
            global.prompt('What recording needs to be replayed?'),
            global.confirm('Do you want to replay the raw session?')
        );
    }

    stopRecording() {
        this.props.stopRecording(global.prompt('What should this recording be named?'));
    }

    render() {
        const { clock, hasRecorder, isRecording, startRecording, hasReplayer, isReplaying, stopReplaying } = this.props;

        return (
            <Container className={styles.app}>
                {hasRecorder && !isReplaying && !isRecording && <Button className={styles.recorderButton} onClick={startRecording}>{'Start recording'}</Button>}
                {hasRecorder && !isReplaying && isRecording && <Button className={styles.recorderButton} onClick={this.stopRecording}>{'Stop recording'}</Button>}
                {hasReplayer && !isRecording && !isReplaying && <Button className={styles.replayerButton} onClick={this.startReplaying}>{'Start replaying'}</Button>}
                {hasReplayer && !isRecording && isReplaying && <Button className={styles.replayerButton} onClick={stopReplaying}>{'Stop replaying'}</Button>}
                <Message className={styles.topRight}>{clock}</Message>
                {this.props.children}
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
