import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Container extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ])
  }

  static defaultProps = {
    className: '',
    children: ''
  }

  render() {
    const { className, children } = this.props

    return <div className={className}>{children}</div>
  }
}
