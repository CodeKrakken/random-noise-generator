import { fireEvent, render, screen } from '@testing-library/react';  
import Voice from './Voice';  
import { VoiceType } from '../shared.types';  

jest.mock('../../content/data', () => ({  
  sliders:      [],  
  buttonGroups: [
    { 
      label: 'Piano' as const, 
      id: 'piano' as const,
      // component: Piano
    }
  ],  
  buttonImages: {}  
}));
  
jest.mock('../Piano/Piano',             () => () => <div data-testid="piano" />);  
jest.mock('../SingleSlider/SingleSlider', () => () => <div />);  
jest.mock('../DoubleSlider/DoubleSlider', () => () => <div />);  
  
const makeVoice = (): VoiceType => ({  
  id:               'test-id',  
  isActive:         false,  
  label:            '1',  
  nextInterval:     0,  
  thisInterval:     0,  
  offsetInterval:   0,  
  bpm:              120,  
  minLevel:         100,  
  maxLevel:         100,  
  activeNotes:      ['1','3','5','6','8','10','12','13'],  
  activeOctaves:    ['4'],  
  activeFrequencies:[261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],  
  activeIntervals:  ['1'],  
  activeSounds:     ['sine'],  
  restChance:       0,  
  minLength:        100,  
  maxLength:        100,  
  minOffset:        0,  
  maxOffset:        0,  
  minDetune:        0,  
  maxDetune:        0,  
  minAttack:        100,  
  maxAttack:        100,  
  minDecay:         100,  
  maxDecay:         100,  
})  
  
describe('Voice', () => {  
  const mockHandleDelete = jest.fn();  
  const mockSetVoices    = jest.fn();  
  const voices = [makeVoice(), makeVoice()];  

  
  beforeEach(() => { jest.clearAllMocks(); });  
  
  it('renders a delete button and calls handleDelete', () => {  
    const voices = [makeVoice(), makeVoice()];  
    render(  
      <Voice  
        i={0}  
        voices={voices}  
        handleDelete={mockHandleDelete}  
        setVoices={mockSetVoices}  
        dataAttribute="Voices"  
      />  
    );  
    fireEvent.click(screen.getByText('X'));  
    expect(mockHandleDelete).toHaveBeenCalledWith(0);  
  });  

  it('shows Piano controls when Piano button is clicked', () => {
    render(
      <Voice
        i={0}
        voices={voices}
        setVoices={mockSetVoices}
        handleDelete={jest.fn()}
        dataAttribute="test"
      />
    )

    expect(document.querySelector('#piano')).not.toBeInTheDocument()
    console.log(screen.getByRole('button', { name: 'Piano' }).outerHTML)
    fireEvent.click(screen.getByRole('button', { name: 'Piano' }))
    // console.log(document.querySelector('#voice')!.innerHTML)
    expect(document.querySelector('#piano')).toBeInTheDocument()
  })
});