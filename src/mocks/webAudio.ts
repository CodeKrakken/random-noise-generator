export class MockGainNode {
  gain = {
    value: 1,
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn()
  };
  connect = jest.fn();
}

export class MockOscillatorNode {
  frequency = { value: 440 };
  type: OscillatorType = "sine";
  connect = jest.fn();
  start = jest.fn();
  stop = jest.fn();
}

export class MockMediaElementSource {
  connect = jest.fn();
}

export class MockAudioContext {
  currentTime = 0;
  destination = {};

  createOscillator = jest.fn(() => new MockOscillatorNode());
  createGain = jest.fn(() => new MockGainNode());
  createMediaElementSource = jest.fn(() => new MockMediaElementSource());

  resume = jest.fn();
  close = jest.fn();
}
