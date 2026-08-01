import { fireEvent, render, screen } from "@testing-library/react";  
import SingleSlider from "./SingleSlider";
import { makeVoice } from "../../shared.test.functions";
import { VoiceType } from "../shared.types";

jest.mock('react-range-slider-input', () => ({  
  __esModule: true,  
  default: require('react').forwardRef(function MockRangeSlider({ onInput }: any, ref: any) {  
    if (ref) {  
      ref.current = {  
        thumb: {  
          lower: { dataset: {} },  
          upper: { dataset: {} }  
        }  
      };  
    }  
    return require('react').createElement(  
      'div', { 'data-testid': 'range-slider' },  
      require('react').createElement('button', {  
        'data-testid': 'trigger',  
        onClick: () => onInput([0, 121])  
      })  
    );  
  })  
}));

describe('SingleSlider', () => {

    it('calls setVoices with updated single value', () => {  
        const mockSetVoices = jest.fn();  
        const voices: Partial<VoiceType>[] = [{ bpm: 120 }];  
        const slider = { label: 'BPM', value: 'bpm', attrName: 'bpm', min: 0, max: 500, row: 1 };  
    
        render(  
            <SingleSlider  
                slider={slider}  
                i={0}  
                voices={voices as VoiceType[]}  
                setVoices={mockSetVoices}  
            />  
        );  
    
        fireEvent.click(screen.getByTestId('trigger'));  
    
        expect(mockSetVoices).toHaveBeenCalledWith(  
            expect.arrayContaining([  
                expect.objectContaining({ bpm: 121 })  
            ])  
        );  
    });
})