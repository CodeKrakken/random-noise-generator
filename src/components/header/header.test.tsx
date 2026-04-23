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

  test('renders Add Voice button', () => {
    render(
      <Header
        addVoice={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={false}
        cycleButtonLabel={false}
      />
    )

    expect(screen.getByText('Add Voice')).toBeInTheDocument()
  })

  test('calls addVoice when clicked', () => {
    const addVoice = jest.fn()

    render(
      <Header
        addVoice={addVoice}
        handleStartStop={jest.fn()}
        showStart={false}
        cycleButtonLabel={false}
      />
    )

    fireEvent.click(screen.getByText('Add Voice'))
    expect(addVoice).toHaveBeenCalled()
  })

  test('shows Start button only when showStart is true', () => {
    const { rerender } = render(
      <Header
        addVoice={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={false}
        cycleButtonLabel={false}
      />
    )

    expect(screen.queryByText('Start')).toBeNull()

    rerender(
      <Header
        addVoice={jest.fn()}
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
        addVoice={jest.fn()}
        handleStartStop={jest.fn()}
        showStart={true}
        cycleButtonLabel={true}
      />
    )

    expect(screen.getByText('Stop')).toBeInTheDocument()
  })
})

