import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { MockAudioContext } from "./mocks/webAudio";

describe("Audio graph behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates an AudioContext and resumes it", () => {
    render(<App />);

    const ctx = (AudioContext as unknown as jest.Mock).mock.instances[0];
    expect(ctx).toBeInstanceOf(MockAudioContext);
    expect(ctx.resume).toHaveBeenCalled();
  });

  test("clicking Add Node creates a node", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText("Add Node"));

    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  test("clicking Start creates oscillator and gain nodes", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText("Add Node"));
    await user.click(screen.getByText("Start"));

    const ctx = (AudioContext as jest.Mock).mock.instances[0];

    expect(ctx.createOscillator).toHaveBeenCalled();
    expect(ctx.createGain).toHaveBeenCalled();
  });

  test("oscillator is connected to gain, gain to destination", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText("Add Node"));
    await user.click(screen.getByText("Start"));

    const ctx = (AudioContext as jest.Mock).mock.instances[0];
    const osc = ctx.createOscillator.mock.results[0].value;
    const gain = ctx.createGain.mock.results[0].value;

    expect(osc.connect).toHaveBeenCalledWith(gain);
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination);
  });

  test("oscillator.start is called when starting", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText("Add Node"));
    await user.click(screen.getByText("Start"));

    const ctx = (AudioContext as jest.Mock).mock.instances[0];
    const osc = ctx.createOscillator.mock.results[0].value;

    expect(osc.start).toHaveBeenCalled();
  });

  test("clicking Stop stops oscillators and mutes gain", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByText("Add Node"));
    await user.click(screen.getByText("Start"));
    await user.click(screen.getByText("Stop"));

    const ctx = (AudioContext as jest.Mock).mock.instances[0];
    const osc = ctx.createOscillator.mock.results[0].value;
    const gain = ctx.createGain.mock.results[0].value;

    expect(osc.stop).toHaveBeenCalled();
    expect(gain.gain.setValueAtTime).toHaveBeenCalled();
  });
});