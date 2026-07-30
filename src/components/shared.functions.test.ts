import { Synth } from "../Synth/Synth"
import { getActiveFrequencies, updateButton, updateVoice } from "./shared.functions"
import { VoiceType } from "./shared.types"


jest.mock('../content/data', () => ({  
  allFrequencies: [
    [  
      261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25
    ],
    [  
      523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.50
    ],
    [ 
      1046.50,  1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760.00,  1864.66,  1975.53,  2093.00
    ]
  ]
}))



describe('getActiveFrequencies', () => {

  it("returns flat freq array based on activeOctaves and activeNotes", () => {
    const voice = {
      activeOctaves: ['0', '2'],
      activeNotes: ['5', '9']
    } as VoiceType

    expect(getActiveFrequencies(voice)).toEqual([329.63, 415.30, 1318.51, 1661.22])
  })
})

describe('updateButton', () => {

  let voices: VoiceType[];

  beforeEach(() => {
    voices = [{
      activeNotes: ['1', '2', '3'],
      activeOctaves: ['0']
    }] as unknown as VoiceType[];

    Synth.voices = JSON.parse(JSON.stringify(voices));
  });

  it('removes a value that is already selected', () => {
    const setVoices = jest.fn();

    const e = {
      currentTarget: {
        value: '2',
      },
    } as React.MouseEvent<HTMLButtonElement>;
    
    expect(voices[0].activeNotes).toEqual(['1', '2', '3']);
    updateButton(e, 'activeNotes', voices, 0, setVoices);
    expect(voices[0].activeNotes).toEqual(['1', '3']);
    expect(setVoices).toHaveBeenCalled();
  });

  it('adds a value that is not already selected', () => {
    const setVoices = jest.fn();

    const e = {
      currentTarget: {
        value: '4',
      },
    } as React.MouseEvent<HTMLButtonElement>;
    
    expect(voices[0].activeNotes).toEqual(['1', '2', '3']);
    updateButton(e, 'activeNotes', voices, 0, setVoices);
    expect(voices[0].activeNotes).toEqual(['1', '2', '3', '4']);
    expect(setVoices).toHaveBeenCalled();
  });
})