import { render, screen, fireEvent }    from '@testing-library/react';
import Inputs                           from './Inputs';
import { updateField, updateCheckbox }  from './Inputs.functions';
import { setUpVoice }                   from '../../App.functions';
import { VoiceType }                    from '../Voice/Voice.types';


// set up mocks

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
    Sounds: ['sine', 'square']
  }
}));

jest.mock('./Inputs.functions', () => ({
  updateField: jest.fn(),
  updateCheckbox: jest.fn()
}));



describe('Inputs', () => {

  const setVoices = jest.fn();

  const voices: VoiceType[] = [setUpVoice()]

  const renderInputs = () => render(
    <Inputs
      i         = {0}
      voices    = {voices}
      setVoices = {setVoices}
    />
  );

  voices[0].bpm       = 120
  voices[0].minLevel  = 10
  voices[0].maxLevel  = 90

  beforeEach(() => { jest.clearAllMocks();});

  it('renders numeric field values from the voice', () => {

    renderInputs();

    expect(screen.getByDisplayValue('120')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('90')).toBeInTheDocument();
  });

  it('renders checkbox state from the voice', () => {

    renderInputs();
    
    const sine    = screen.getByDisplayValue('sine');
    const square  = screen.getByDisplayValue('square');

    expect(sine).toBeChecked();
    expect(square).not.toBeChecked();
  });

  it('calls updateField when a numeric field changes', () => {

    renderInputs();

    fireEvent.change(
      screen.getByDisplayValue('120'),
      { target: { value: '140'} }
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

    renderInputs();

    fireEvent.change(
      screen.getByDisplayValue('10'),
      { target: { value: '20'} }
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

    renderInputs();

    fireEvent.change(
      screen.getByDisplayValue('90'),
      { target: { value: '100'} }
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

    renderInputs();

    fireEvent.click(
      screen.getByDisplayValue('square')
    );

    expect(updateCheckbox).toHaveBeenCalledTimes(1);

    expect(updateCheckbox).toHaveBeenCalledWith(
      expect.any(Object),
      'activeSounds',
      voices,
      0,
      setVoices
    );
  });

  it('supports multiple voices independently', () => {

    const multiVoices = [
      {
        bpm           : 120,
        minLevel      : 10,
        maxLevel      : 90,
        activeSounds  : ['sine']
      },
      {
        bpm           : 200,
        minLevel      : 30,
        maxLevel      : 60,
        activeSounds  : ['square']
      }
    ];

    render(
      <Inputs
        i         = {1}
        voices    = {multiVoices as VoiceType[]}
        setVoices = {setVoices}
      />
    );

    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
    expect(screen.getByDisplayValue('square')).toBeChecked();
    expect(screen.getByDisplayValue('sine')).not.toBeChecked();
  });
});