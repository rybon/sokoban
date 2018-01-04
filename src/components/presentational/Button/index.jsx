import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './styles.css'

export default class Button extends PureComponent {
  static propTypes = {
    selected: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.string
  }

  static defaultProps = {
    selected: false,
    className: '',
    onClick: () => ({}),
    children: ''
  }

  render() {
    const { selected, className, onClick, children } = this.props

    return (
      <div
        className={classNames(
          styles.button,
          selected && styles.selected,
          className
        )}
        role="presentation"
        onClick={onClick}
      >
        {children}
      </div>
    )
  }
}
