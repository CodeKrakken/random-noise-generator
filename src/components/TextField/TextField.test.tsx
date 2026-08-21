import { render, screen, fireEvent } from '@testing-library/react';  
import TextField from './TextField';  
import { VoiceType } from '../shared.types';  
import { updateVoice } from '../shared.functions';  
  
jest.mock('../shared.functions', () => ({  
  updateVoice: jest.fn()  
}));  
  
const makeVoice = (): VoiceType => ({  
  id:                'test-id',  
  isActive:          false,  
  label:             'Voice 1',  
  nextInterval:      0,  
  thisInterval:      0,  
  offsetInterval:    0,  
  bpm:               120,  
  minLevel:          100,  
  maxLevel:          100,  
  activeNotes:       ['1','3','5','6','8','10','12','13'],  
  activeOctaves:     ['4'],  
  activeFrequencies: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],  
  activeIntervals:   ['1'],  
  activeSounds:      ['sine'],  
  restChance:        0,  
  minLength:         100,  
  maxLength:         100,  
  minOffset:         0,  
  maxOffset:         0,  
  minDetune:         0,  
  maxDetune:         0,  
  minAttack:         100,  
  maxAttack:         100,  
  minDecay:          100,  
  maxDecay:          100,  
  colour:            '#ff0000'
})  
  
describe('TextField', () => {  
  const mockSetVoices = jest.fn();  
  
  beforeEach(() => { jest.clearAllMocks(); });  
  
  it('renders an input displaying the voice label', () => {  
    const voices = [makeVoice()];  
    render(  
      <TextField attrName="label" i={0} voices={voices} setVoices={mockSetVoices} />  
    );  
    expect(screen.getByDisplayValue('Voice 1')).toBeInTheDocument();  
  });  
  
  it('calls updateVoice when the input value changes', () => {  
    const voices = [makeVoice()];  
    render(  
      <TextField attrName="label" i={0} voices={voices} setVoices={mockSetVoices} />  
    );  
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Name' } });  
    expect(updateVoice).toHaveBeenCalledWith(voices, 0, mockSetVoices);  
  });  
});