import 'styles/reset.css';
import 'styles/global.css';

import styles from './styles';

import React from 'react';
import { connect } from 'react-redux';
import {
    Selectors as TimeSelectors
} from 'domains/time';
import { ContainerComponent } from 'components/base';
import {
    Container,
    Message
} from 'components/presentational';

const mapStateToProps = (state) => ({
    clock: TimeSelectors.clock(state)
});

class App extends ContainerComponent {
    render() {
        const { clock } = this.props;

        return (
            <Container className={styles.app}>
                <Message className={styles.topRight}>{clock}</Message>
                {this.props.children}
            </Container>
        );
    }
}

export default connect(mapStateToProps, null)(App);
