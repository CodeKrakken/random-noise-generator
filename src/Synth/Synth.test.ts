import { Synth } from './Synth';
// import { setUpVoice } from '../components/Interface/Interface.functions';
import { VoiceType } from '../components/shared.types';
import { runInterval, getContext } from './Synth.functions';
import { createMockContext } from './Synth.test.functions';


jest.mock('./Synth.functions', () => ({
  runInterval: jest.fn(),
  getContext: jest.fn(() => ({ currentTime: 0 })),
}));

describe('Synth', () => {

  beforeEach(() => {
    Synth.voices = [];
    jest.clearAllMocks();
  });

  describe('add', () => {

    // it('calls runInterval when running is true', () => {

    //   const voice = setUpVoice([]);
    //   const running = true;
    //   const voicesRef = { current: [voice] };

    //   Synth.add(voice, running, voicesRef);

    //   expect(runInterval).toHaveBeenCalled();
    // });
  });


  describe('start', () => {

    // it('calls runInterval for each voice with correct arguments', () => {

    //   const voice1: VoiceType = setUpVoice([])
    //   const voice2: VoiceType = setUpVoice([voice1])
    //   const running = false;
    //   const voicesRef = { current: [voice1, voice2] };
    //   const mockContext = createMockContext();
    //   (getContext as jest.Mock).mockReturnValue(mockContext);

    //   const args = [
    //     voicesRef,
    //     mockContext
    //   ];

    //   Synth.add(voice1, running, voicesRef);
    //   Synth.add(voice2, running, voicesRef);
    //   Synth.start(voicesRef);

    //   expect(runInterval).toHaveBeenCalledTimes(2);
    //   expect(runInterval).toHaveBeenCalledWith(voice1, ...args);
    //   expect(runInterval).toHaveBeenCalledWith(voice2, ...args);
    // });
  });


  describe('integration', () => {

    // it('adds, updates, and deletes voices', () => {

    //   const voice1 = setUpVoice([]);
    //   const voice2 = setUpVoice([]);
    //   let running = false;
    //   const voicesRef = { current: [] };

    //   // test add
    //   Synth.add(voice1, running, voicesRef);
    //   Synth.add(voice2, running, voicesRef);
    //   expect(Synth.voices.length).toBe(2);

    //   // test update
    //   voice1.bpm = 200;
    //   Synth.update(voice1, 0);
    //   expect(Synth.voices[0].bpm).toBe(200);

    //   // test delete
    //   Synth.delete(0);
    //   expect(Synth.voices.length).toBe(1);
    //   expect(Synth.voices[0]).toBe(voice2);

    //    // test stop  
    //   Synth.voices[0].isActive = true; // Set active before stopping  
    //   Synth.stop();  
    //   expect(Synth.voices[0].isActive).toBe(false);  
    // });
  });
});
