import sinon from 'sinon'
import Button from './index'

describe('<Button />', () => {
  const onClick = sinon.spy()

  const button = mount(<Button selected onClick={onClick} />)

  it('renders correctly', () => {
    expect(button).toMatchSnapshot()
  })

  it('responds to click events', () => {
    button.find('div').simulate('click')

    expect(onClick.called).toBe(true)
  })
})
