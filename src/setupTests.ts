// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import "@testing-library/jest-dom";
import { MockAudioContext } from "./mocks/webAudio";

Object.defineProperty(global, "AudioContext", {
  writable: true,
  value: MockAudioContext
});

// Mock <audio>
Object.defineProperty(global, "Audio", {
  writable: true,
  value: jest.fn(() => ({
    play: jest.fn()
  }))
});
