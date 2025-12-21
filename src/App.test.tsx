import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./components/Header";

describe("Header component", () => {
  let addNodeMock: jest.Mock;
  let handleStartStopMock: jest.Mock;

  beforeEach(() => {
    addNodeMock = jest.fn();
    handleStartStopMock = jest.fn();
  });

  test("renders the static text 'octopus'", () => {
    render(
      <Header
        addNode={addNodeMock}
        handleStartStop={handleStartStopMock}
        showStart={false}
        cycleButtonLabel={false}
      />
    );
    expect(screen.getByText(/octopus/i)).toBeInTheDocument();
  });

  test("renders 'Add Node' button and calls addNode when clicked", async () => {
    render(
      <Header
        addNode={addNodeMock}
        handleStartStop={handleStartStopMock}
        showStart={false}
        cycleButtonLabel={false}
      />
    );

    const addButton = screen.getByRole("button", { name: /add node/i });
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);
    expect(addNodeMock).toHaveBeenCalledTimes(1);
  });

  test("does not render Start/Stop button if showStart is false", () => {
    render(
      <Header
        addNode={addNodeMock}
        handleStartStop={handleStartStopMock}
        showStart={false}
        cycleButtonLabel={false}
      />
    );

    const startStopButton = screen.queryByRole("button", { name: /start|stop/i });
    expect(startStopButton).not.toBeInTheDocument();
  });

  test("renders Start button if showStart is true and cycleButtonLabel is false", () => {
    render(
      <Header
        addNode={addNodeMock}
        handleStartStop={handleStartStopMock}
        showStart={true}
        cycleButtonLabel={false}
      />
    );

    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton.textContent).toBe("Start");
  });

  test("renders Stop button if showStart is true and cycleButtonLabel is true", () => {
    render(
      <Header
        addNode={addNodeMock}
        handleStartStop={handleStartStopMock}
        showStart={true}
        cycleButtonLabel={true}
      />
    );

    const stopButton = screen.getByRole("button", { name: /stop/i });
    expect(stopButton).toBeInTheDocument();
    expect(stopButton.textContent).toBe("Stop");
  });

  test("calls handleStartStop when Start/Stop button is clicked", async () => {
    render(
      <Header
        addNode={addNodeMock}
        handleStartStop={handleStartStopMock}
        showStart={true}
        cycleButtonLabel={false}
      />
    );

    const startButton = screen.getByRole("button", { name: /start/i });
    await userEvent.click(startButton);
    expect(handleStartStopMock).toHaveBeenCalledTimes(1);
  });
});
