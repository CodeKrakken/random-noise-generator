import { Synth }                            from './Synth';  
import { VoiceType, HitType }                        from '../components/shared.types';  
import { runInterval, getContext }          from './Synth.functions';  
import { createMockContext }                from './Synth.test.functions';  
  
  
jest.mock('../content/data', () => ({  
  demoVoices: []  
}));  
  
jest.mock('./Synth.functions', () => ({  
  runInterval: jest.fn(),  
  getContext:  jest.fn(() => ({ currentTime: 0 })),  
}));  
  
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
  colour:           "#33ff00"
})  
  
describe('Synth', () => {  
  
  beforeEach(() => {  
    Synth.voices = [];  
    jest.clearAllMocks();  
  });  
  
  describe('add', () => {  
  
    it('calls runInterval when running is true', () => {  
      const voice = makeVoice();  
      const running = true;  
      const voicesRef = { current: [voice] };  
      Synth.add(voice, running, voicesRef);  
      expect(runInterval).toHaveBeenCalled();  
    });  
  });  
  
  
  describe('start', () => {  
  
    it('calls runInterval for each voice with correct arguments', () => {  
      const voice1: VoiceType = makeVoice()  
      const voice2: VoiceType = makeVoice()  
      const running = false;  
      const voicesRef = { current: [voice1, voice2] };  
      const mockContext = createMockContext();  
      (getContext as jest.Mock).mockReturnValue(mockContext);  
      const recordedHits: HitType[] = []
  
      const args = [voicesRef, mockContext, recordedHits];  
  
      Synth.add(voice1, running, voicesRef);  
      Synth.add(voice2, running, voicesRef);  
      Synth.start(voicesRef);  
  
      expect(runInterval).toHaveBeenCalledTimes(2);  
      expect(runInterval).toHaveBeenCalledWith(voice1, ...args);  
      expect(runInterval).toHaveBeenCalledWith(voice2, ...args);  
    });  
  });  

  describe('resumeContext', () => {
    it('calls getContext', () => {
      Synth.resumeContext()
      expect(getContext).toHaveBeenCalled()
    })
  })
  
  
  describe('integration', () => {  
  
    it('adds, updates, and deletes voices', () => {  
      const voice1 = makeVoice();  
      const voice2 = makeVoice();  
      const running = false;  
      const voicesRef = { current: [] as VoiceType[] };  
  
      // add  
      Synth.add(voice1, running, voicesRef);  
      Synth.add(voice2, running, voicesRef);  
      expect(Synth.voices.length).toBe(2);  
  
      // update  
      voice1.bpm = 200;  
      Synth.update(voice1, 0);  
      expect(Synth.voices[0].bpm).toBe(200);  
  
      // delete  
      Synth.delete('test-id');  
      expect(Synth.voices.length).toBe(1);  
      expect(Synth.voices[0]).toBe(voice2);  
  
      // stop  
      Synth.voices[0].isActive = true;  
      Synth.stop();  
      expect(Synth.voices[0].isActive).toBe(false);  
    });  
  });  
});
