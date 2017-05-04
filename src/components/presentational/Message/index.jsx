import styles from './styles';

import React, {
    PureComponent
} from 'react';
import classNames from 'classnames';

export default class Message extends PureComponent {
    render() {
        const { className, children } = this.props;

        return (
            <p className={classNames(styles.message, className)}>{children}</p>
        );
    }
}
