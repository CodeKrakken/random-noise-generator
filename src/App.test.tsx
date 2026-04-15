import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('header', () => {

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('adds a node', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    expect(document.querySelector('.node')).toBeInTheDocument()
  })

  test('shows Start button after adding node', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('starts audio when Start clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.click(screen.getByText('Start'))

    // we can't easily inspect internals, but we can assert Stop appears
    expect(screen.getByText('Stop')).toBeInTheDocument()
  })

  test('stops audio when Stop clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.click(screen.getByText('Start'))
    fireEvent.click(screen.getByText('Stop'))

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('new node copies previous node settings', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.change(screen.getByTitle('BPM'), { target: { value: '200' } })

    fireEvent.click(screen.getByText('Add Node'))

    const inputs = document.querySelectorAll('[title="BPM"]')

    expect((inputs[1] as HTMLInputElement).value).toBe('200')
  })
})