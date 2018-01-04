import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './styles.css'

export default class Message extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const { className, children } = this.props

    return <p className={classNames(styles.message, className)}>{children}</p>
  }
}
