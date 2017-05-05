import styles from './styles';

import React, {
    PureComponent
} from 'react';
import classNames from 'classnames';

export default class Button extends PureComponent {
    render() {
        const { selected, className, onClick, children } = this.props;

        return (
            <div className={classNames(styles.button, selected && styles.selected, className)} onClick={onClick}>
                {children}
            </div>
        );
    }
}
