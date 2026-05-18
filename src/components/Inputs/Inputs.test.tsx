import { render, screen, fireEvent } from '@testing-library/react';
import Inputs from './Inputs';
import { updateField, updateCheckbox } from '../Voice/functions';

jest.mock('../../content/data', () => ({
  fields: {
    bpm: {
      label: 'BPM',
      value: 'bpm',
      input: 'number'
    },
    level: {
      label: 'Level',
      value: 'Level',
      input: 'range'
    }
  },
  extrema: ['min', 'max'],
  checkboxGroups: {
    Waves: ['sine', 'square']
  }
}));

jest.mock('../voice/functions', () => ({
  updateField: jest.fn(),
  updateCheckbox: jest.fn()
}));


describe('Inputs', () => {

  const setVoices = jest.fn();

  const voices: any = [{
    bpm: 120,
    minLevel: 10,
    maxLevel: 90,
    activeWaves: ['sine']
  }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders numeric field values from the voice', () => {

    render(
      <Inputs
        i={0}
        voices={voices}
        setVoices={setVoices}
      />
    );

    expect(
      screen.getByDisplayValue('120')
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue('10')
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue('90')
    ).toBeInTheDocument();
  });

  it('renders checkbox state from the voice', () => {

    render(
      <Inputs
        i={0}
        voices={voices}
        setVoices={setVoices}
      />
    );

    const sine = screen.getByDisplayValue('sine');
    const square = screen.getByDisplayValue('square');

    expect(sine).toBeChecked();
    expect(square).not.toBeChecked();
  });

  it('calls updateField when a numeric field changes', () => {

    render(
      <Inputs
        i={0}
        voices={voices}
        setVoices={setVoices}
      />
    );

    fireEvent.change(
      screen.getByDisplayValue('120'),
      {
        target: {
          value: '140'
        }
      }
    );

    expect(updateField).toHaveBeenCalledTimes(1);

    expect(updateField).toHaveBeenCalledWith(
      expect.any(Object),
      'bpm',
      voices,
      0,
      setVoices
    );
  });

  it('calls updateField for ranged min values', () => {

    render(
      <Inputs
        i={0}
        voices={voices}
        setVoices={setVoices}
      />
    );

    fireEvent.change(
      screen.getByDisplayValue('10'),
      {
        target: {
          value: '20'
        }
      }
    );

    expect(updateField).toHaveBeenCalledWith(
      expect.any(Object),
      'minLevel',
      voices,
      0,
      setVoices
    );
  });

  it('calls updateField for ranged max values', () => {

    render(
      <Inputs
        i={0}
        voices={voices}
        setVoices={setVoices}
      />
    );

    fireEvent.change(
      screen.getByDisplayValue('90'),
      {
        target: {
          value: '100'
        }
      }
    );

    expect(updateField).toHaveBeenCalledWith(
      expect.any(Object),
      'maxLevel',
      voices,
      0,
      setVoices
    );
  });

  it('calls updateCheckbox when a checkbox changes', () => {

    render(
      <Inputs
        i={0}
        voices={voices}
        setVoices={setVoices}
      />
    );

    fireEvent.click(
      screen.getByDisplayValue('square')
    );

    expect(updateCheckbox).toHaveBeenCalledTimes(1);

    expect(updateCheckbox).toHaveBeenCalledWith(
      expect.any(Object),
      'activeWaves',
      voices,
      0,
      setVoices
    );
  });

  it('supports multiple voices independently', () => {

    const multiVoices = [
      {
        bpm: 120,
        minLevel: 10,
        maxLevel: 90,
        activeWaves: ['sine']
      },
      {
        bpm: 200,
        minLevel: 30,
        maxLevel: 60,
        activeWaves: ['square']
      }
    ];

    render(
      <Inputs
        i={1}
        voices={multiVoices as any}
        setVoices={setVoices}
      />
    );

    expect(
      screen.getByDisplayValue('200')
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue('30')
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue('60')
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue('square')
    ).toBeChecked();

    expect(
      screen.getByDisplayValue('sine')
    ).not.toBeChecked();
  });

});