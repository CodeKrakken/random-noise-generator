import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'

describe('header', () => {

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('renders Add Node button', () => {
    render(
      <Header
        addNode={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={false}
        cycleButtonLabel={false}
      />
    )

    expect(screen.getByText('Add Node')).toBeInTheDocument()
  })

  test('calls addNode when clicked', () => {
    const addNode = jest.fn()

    render(
      <Header
        addNode={addNode}
        handleStartStop={jest.fn()}
        showStart={false}
        cycleButtonLabel={false}
      />
    )

    fireEvent.click(screen.getByText('Add Node'))
    expect(addNode).toHaveBeenCalled()
  })

  test('shows Start button only when showStart is true', () => {
    const { rerender } = render(
      <Header
        addNode={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={false}
        cycleButtonLabel={false}
      />
    )

    expect(screen.queryByText('Start')).toBeNull()

    rerender(
      <Header
        addNode={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={true}
        cycleButtonLabel={false}
      />
    )

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('toggles label between Start and Stop', () => {
    render(
      <Header
        addNode={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={true}
        cycleButtonLabel={true}
      />
    )

    expect(screen.getByText('Stop')).toBeInTheDocument()
  })
})

