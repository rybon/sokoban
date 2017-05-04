import styles from './styles';

import React from 'react';
import { connect } from 'react-redux';
import {
    ActionCreators as LevelActionCreators
} from 'domains/level';
import { ContainerComponent } from 'components/base';
import {
    Container,
    Message,
    Button
} from 'components/presentational';

const mapDispatchToProps = {
    nextLevel: LevelActionCreators.nextLevel
};

class GameModal extends ContainerComponent {
    constructor() {
        super();
        this.modalKeyMap = {
            Space: () => {
                this.props.nextLevel()
            }
        };
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
