import { fireEvent, render, screen } from '@testing-library/react';
import Voice from './Voice';
// import { setUpVoice } from '../Interface/Interface.functions';
import { VoiceType } from '../shared.types';

jest.mock('../../content/data', () => ({  
  singleSliders: [],  
  doubleSliders: [],  
  buttonGroups: []  
}));  
  
// Also mock heavy child components to avoid their own import chains:  
jest.mock('../Piano/Piano', () => () => <div data-testid="piano" />);  
jest.mock('../SingleSlider/SingleSlider', () => () => <div />);  
jest.mock('../DoubleSlider/DoubleSlider', () => () => <div />);  
jest.mock('../GroupButton/GroupButton', () => () => <div />);  

describe('Voice', () => {
  const mockHandleDelete = jest.fn();
  const mockSetVoices = jest.fn();

  const voice = (i: number, voices: VoiceType[]) => <Voice
    i={i}
    voices={voices}
    handleDelete={mockHandleDelete}
    setVoices={mockSetVoices}
    dataAttribute="Voices"
  />

  beforeEach(() => { jest.clearAllMocks(); });

  jest.mock('../../content/data', () => ({  
    singleSliders: [],  
    doubleSliders: [],  
    buttonGroups: []  
  }));  
    
  // it('renders a delete button and calls handleDelete', () => {  
  //   const voices = [setUpVoice([]), setUpVoice([])];  
  //   render(  
  //     <Voice i={0} voices={voices} handleDelete={mockHandleDelete} setVoices={mockSetVoices} dataAttribute="Voices" />  
  //   );  
  //   fireEvent.click(screen.getByRole('button'));  
  //   expect(mockHandleDelete).toHaveBeenCalledWith(0);  
  // });  
});
