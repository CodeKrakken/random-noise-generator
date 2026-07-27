import { render, screen, fireEvent } from '@testing-library/react';
import TextField from './TextField';
// import { setUpVoice } from '../Interface/Interface.functions';
import { VoiceType } from '../shared.types';

jest.mock('../../content/data', () => ({
  fields: {
    level: {
      value: 'Level',
      input: 'range'
    }
  },
  extrema: ['min', 'max']
}));

jest.mock('../shared.functions', () => ({
  updateTextField: jest.fn()
}));

describe('TextField', () => {

  const mockSetVoices = jest.fn();
  // const voices: VoiceType[] = [setUpVoice([])];

  // voices[0].maxLevel = 80;

  beforeEach(() => { jest.clearAllMocks(); });
  
  

  // import { render, screen, fireEvent }    from '@testing-library/react';
  // import Inputs                           from './Inputs';
  // import { updateTextField, updateButton }  from './Inputs.functions';
  // import { setUpVoice }                   from '../../components/Interface/Interface.functions';
  // import { VoiceType }                    from '../shared.types';
  
  
  // jest.mock('./Inputs.functions', () => ({
  //   updateTextField: jest.fn(),
  //   updateButton: jest.fn()
  // }));
  
  
  // describe('Inputs', () => {
  
  //   const setVoices = jest.fn();
  //   const voices: VoiceType[] = [setUpVoice()]
  
  //   const renderInputs = () => render(
  //     <Inputs
  //       i         = {0}
  //       voices    = {voices}
  //       setVoices = {setVoices}
  //     />
  //   );
  
  //   voices[0].bpm = 120
  
  //   beforeEach(() => { jest.clearAllMocks();});
  
    
  //   it('calls updateTextField when a numeric TextField changes', () => {
  
  //     renderInputs();
  
  //     fireEvent.change(
  //       screen.getByDisplayValue('120'), { target: { value: '140'} }
  //     );
  
  //     expect(updateTextField).toHaveBeenCalledTimes(1);
  
  //     expect(updateTextField).toHaveBeenCalledWith(
  //       expect.any(Object),
  //       'bpm',
  //       voices,
  //       0,
  //       setVoices
  //     );
  //   });
  // });

  // import { updateTextField, updateButton } from './Inputs.functions';
  // import { setUpVoice } from '../Interface/Interface.functions';
  // import { VoiceType } from '../shared.types';
  // import { ChangeEvent } from 'react';
  
  
  // describe('Inputs.functions', () => {
  //   let voices: VoiceType[];
  //   let setVoices: jest.Mock;
  
  //   beforeEach(() => {
  //     voices = [setUpVoice(), setUpVoice()];
  //     voices[0].label = 1;
  //     voices[0].bpm = 120;
  //     voices[1].label = 2;
  //     voices[1].bpm = 100;
  //     setVoices = jest.fn();
  //     jest.clearAllMocks();
  //   });
  
  //   const createEvent = (value: string) => (
  //     { target: { value: value }} as ChangeEvent<HTMLInputElement, Element>
  //   )
  
  //   describe('updateTextField', () => {
  
  //     it('handles range TextField updates (maxLevel)', () => {
  //       const event = createEvent('99')
  
  //       updateTextField(event, 'maxLevel', voices, 0, setVoices);
  
  //       expect(voices[0].maxLevel).toBe(99);
  //     });
  //   });
});
