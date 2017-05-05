import 'styles/reset.css';
import 'styles/global.css';

import styles from './styles';

import React from 'react';
import { connect } from 'react-redux';
import {
    Selectors as TimeSelectors
} from 'domains/time';
import {
    ActionCreators as RecorderActionCreators,
    Selectors as RecorderSelectors
} from 'domains/recorder';
import { ContainerComponent } from 'components/base';
import {
    Button,
    Container,
    Message
} from 'components/presentational';

const mapStateToProps = (state) => ({
    clock: TimeSelectors.clock(state),
    hasRecorder: RecorderSelectors.hasRecorder(state),
    isRecording: RecorderSelectors.isRecording(state)
});
const mapDispatchToProps = {
    startRecording: RecorderActionCreators.startRecording,
    stopRecording: RecorderActionCreators.stopRecording
};

class App extends ContainerComponent {
    constructor() {
        super();
        this.stop = this.stop.bind(this);
    }

    stop() {
        this.props.stopRecording(global.prompt('What should this recording be named?'))
    }

    render() {
        const { clock, hasRecorder, isRecording, startRecording } = this.props;

        return (
            <Container className={styles.app}>
                {hasRecorder && !isRecording && <Button className={styles.recorderButton} onClick={startRecording}>{'Start recording'}</Button>}
                {hasRecorder && isRecording && <Button className={styles.recorderButton} onClick={this.stop}>{'Stop recording'}</Button>}
                <Message className={styles.topRight}>{clock}</Message>
                {this.props.children}
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
