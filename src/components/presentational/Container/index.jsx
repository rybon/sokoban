// @flow

import React, { PureComponent } from 'react'

type Props = {
  className: ?string,
  children: ?string | ?Array<any> | ?Object
}

export default class Container extends PureComponent<Props> {
  static defaultProps = {
    className: '',
    children: ''
  }

  render() {
    const { className, children } = this.props

    return <div className={className}>{children}</div>
  }
}
