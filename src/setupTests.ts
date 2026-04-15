// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

class MockOscillator {
  frequency = { value: 0 }
  type = 'sine'
  connect = jest.fn()
  start = jest.fn()
  stop = jest.fn()
}

class MockGain {
  gain = {
    value: 0,
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn()
  }
  connect = jest.fn()
}

class MockAudioContext {
  currentTime = 0
  destination = {}
  createOscillator = jest.fn(() => new MockOscillator())
  createGain = jest.fn(() => new MockGain())
  createMediaElementSource = jest.fn(() => ({ connect: jest.fn() }))
  resume = jest.fn()
}

global.AudioContext = MockAudioContext as any
global.Audio = jest.fn(() => ({
  play: jest.fn()
})) as any