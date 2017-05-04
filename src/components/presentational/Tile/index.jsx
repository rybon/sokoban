import styles from './styles';

import React, {
    PureComponent
} from 'react';

export default class Tile extends PureComponent {
    render() {
        const { type } = this.props;

        return (
            <div className={styles[type]}></div>
        );
    }
}
