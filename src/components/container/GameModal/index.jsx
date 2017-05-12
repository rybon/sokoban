import styles from './styles';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    ActionCreators as InteractionActionCreators
} from 'domains/interaction';
import {
    ActionCreators as LevelActionCreators
} from 'domains/level';
import {
    Container,
    Message,
    Button
} from 'components/presentational';

const mapDispatchToProps = {
    bindKeys: InteractionActionCreators.bindKeys,
    unbindKeys: InteractionActionCreators.unbindKeys,
    nextLevel: LevelActionCreators.nextLevel
};

class GameModal extends Component {
    constructor(props) {
        super(props);
        this.modalKeyMap = {
            Space: () => {
                this.props.nextLevel()
            }
        };
    }

    componentDidMount() {
        this.props.bindKeys(this.modalKeyMap);
    }

    componentWillUnmount() {
        this.props.unbindKeys(this.modalKeyMap);
        this.modalKeyMap = null;
    }

    render() {
        const message = 'You have done a good job!';
        const button = 'OK';

        return (
            <Container className={styles.overlay}>
                <Container className={styles.modal}>
                    <Message>{message}</Message>
                    <Button selected={true}>{button}</Button>
                </Container>
            </Container>
        );
    }
}

export default connect(null, mapDispatchToProps)(GameModal);
