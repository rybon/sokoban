// @flow

import React, { PureComponent } from 'react'
import classNames from 'classnames'

import styles from './styles.css'

type Props = {
  className: string,
  children: string
}

export default class Message extends PureComponent<Props> {
  static defaultProps = {
    className: ''
  }

  render() {
    const { className, children } = this.props

    return <p className={classNames(styles.message, className)}>{children}</p>
  }
}
