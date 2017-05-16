import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Container extends PureComponent {
  render() {
    const { className, children } = this.props

    return <div className={className}>{children}</div>
  }
}

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}
