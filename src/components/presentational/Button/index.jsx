// @flow

import React, { PureComponent } from 'react'
import classNames from 'classnames'

import styles from './styles.css'

type Props = {
  selected: boolean,
  className: string,
  onClick: () => mixed,
  children: string
}

export default class Button extends PureComponent<Props> {
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
