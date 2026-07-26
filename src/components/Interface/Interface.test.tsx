import { render, screen, fireEvent, act } from '@testing-library/react';
import Interface from './Interface';
import { Synth } from '../../Synth/Synth';

jest.mock('../../Synth/Synth', () => ({
  Synth: {
    add: jest.fn(),
    delete: jest.fn(),
    start: jest.fn(),
    stop: jest.fn()
  }
}));

jest.mock('../Header/Header', () => ({
  __esModule: true,
  default: ({ handleStartStop, handleAddVoice }: any) => (
    <div>
      <button data-testid="add-voice" onClick={handleAddVoice} />
      <button data-testid="start-stop" onClick={handleStartStop}>
        Start
      </button>
    </div>
  )
}));

jest.mock('../Voice/Voice', () => ({
  __esModule: true,
  default: ({ handleDelete, i }: any) => (
    <button
      data-testid={`delete-voice-${i}`}
      onClick={() => handleDelete(i)}
    />
  )
}));


// describe('Interface', () => {
//   beforeEach(() => { 
//     jest.clearAllMocks(); 
//     render(<Interface />);
//   });

//   it('deletes voice when handleDelete is called', async () => {
//     await act(async () => { fireEvent.click(screen.getByTestId('add-voice')); });
//     await act(async () => { fireEvent.click(screen.getByTestId('delete-voice-0')); });

//     expect(Synth.delete).toHaveBeenCalledWith(0);
//   });

//   it('calls toggleRunning(false) and Synth.stop when stop is triggered', async () => {
//     await act(async () => { fireEvent.click(screen.getByTestId('add-voice')); });

//     const startStopButton = screen.getByTestId('start-stop');

//     await act(async () => { fireEvent.click(startStopButton); });
//     await act(async () => { fireEvent.click(startStopButton); });

//     expect(Synth.stop).toHaveBeenCalled();
//     expect(startStopButton).toHaveTextContent('Start');
//   });
// });