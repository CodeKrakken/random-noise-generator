import { VoiceProps, Scalar, Compound } from '../../types/voice'
import {allNotes, allOctaves, allIntervals, allWaveShapes} from '../../content/data'
import Input from '../input/Input'

export default function Voice(props: VoiceProps) {

  const {
    voice, 
    i, 
    setVoices, 
    voices,  
    handleDelete
  } = props

  const updateVoice = (e: any, attribute: Scalar) => {
    voices[i][attribute] = +e.target!.value
    setVoices([voices.slice(0,i), voices[i], voices.slice(i+1)].flat())
  } 

  const updateCheckbox = (e: any, attribute: Compound) => {

    if ((voices[i][attribute]).includes(e.target.value)) {
      voices[i][attribute] = voices[i][attribute].filter(value => value !== e.target.value)
    } else {
      voices[i][attribute] = [voices[i][attribute], e.target.value].flat()
    }
    
    setVoices([voices.slice(0,i), voices[i], voices.slice(i+1)].flat()
    )
  }

  

  const attributes: any = {
    label: [
      <Input 
        className='textbox'  
        title= "Label"
        label= "Name"
        id= {`label${i}`}
        i={i}
        type= "text"
        value= {voice.label}
        onChange= {(e: any) => updateVoice(e, 'label')}
      />
    ],
    bpm: [
      <Input
        className= 'textbox'
        title= "BPM"
        label= "BPM"
        id= {`bpm${i}`}
        i={i}
        type= "number"
        value= {voice.bpm}
        onChange= {(e: any) => updateVoice(e, 'bpm')}
        maxLength= {5}
        min= {0}
        max= {60000}
      />
    ],
    restChance: [
      <Input
        className= 'textbox'
        title= 'Rest %'
        label= 'Rest %'
        id= {`rest${i}`}
        i={i}
        type= "number"
        value= {voice.rest}
        onChange= {(e: any) => updateVoice(e, 'rest')}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ],
    level: [
      <Input
        className= 'textbox'
        title= 'Min Level'
        label= 'Level'
        id= {`minLevel${i}`}
        i={i}
        type= "number"
        value= {voice.minLevel}
        onChange= {(e: any) => updateVoice(e, 'minLevel')}
        min= {0}
        max= {100}
        maxLength= {3}
      />,
      <Input
        className= 'textbox'
        title= 'Max Level'
        label= 'Level'
        id= {`maxLevel${i}`}
        i={i}
        type= "number"
        value= {voice.maxLevel}
        onChange= {(e: any) => updateVoice(e, 'maxLevel')}
        min= {0}
        max= {100}
        maxLength= {3} 
      />
    ],
    length: [
      <Input
        className= 'textbox'
        title= 'Min Length'
        label= 'Length'
        id= {`minLength${i}`}
        i={i}
        type= "number"
        value= {voice.minNoteLength}
        onChange= {(e: any) => updateVoice(e, 'minNoteLength')}
        min= {0}
        max= {100}
        maxLength= {3}
      />,
      <Input
        className= 'textbox'
        title= 'Max Length'
        label= 'Length'
        id= {`maxLength${i}`}
        i={i}
        type= "number"
        value= {voice.maxNoteLength}
        onChange= {(e: any) => updateVoice(e, 'maxNoteLength')}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ],
    offset: [
      <Input
        className= 'textbox'
        title= 'Min Offset'
        label= 'Offset'
        id= {`minOffset${i}`}
        i={i}
        type= "number"
        value= {voice.minOffset}
        onChange= {(e: any) => updateVoice(e, 'minOffset')}
        min= {0}
        max= {100}
        maxLength= {3}
      />,
      <Input
        className= 'textbox'
        title= 'Max Offset'
        label= 'Offset'
        id= {`maxOffset${i}`}
        i={i}
        type= "number"
        value= {voice.maxOffset}
        onChange= {(e: any) => updateVoice(e, 'maxOffset')}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ],
    detune: [
      <Input
        className= 'textbox'
        title= 'detune'
        label= 'Detune'
        id= {`minDetune${i}`}
        i={i}
        type= "number"
        value= {voice.minDetune}
        onChange= {(e: any) => updateVoice(e, 'minDetune')}
        min= {-100}
        max= {100}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'detune'
        label= 'Detune'
        id= {`maxDetune${i}`}
        i={i}
        type= "number"
        value= {voice.maxDetune}
        onChange= {(e: any) => updateVoice(e, 'maxDetune')}
        min= {-100}
        max= {100}
        maxLength= {4}
      />
    ],
    fadeIn: [
      <Input
        className= 'textbox'
        title= 'Min Fade In'
        label= 'Fade In'
        id= {`minFadeIn${i}`}
        i={i}
        type= "number"
        value= {voice.minFadeIn}
        onChange= {(e: any) => updateVoice(e, 'minFadeIn')}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'Max Fade In'
        label= 'Fade In'
        id= {`maxFadeIn${i}`}
        i={i}
        type= "number"
        value= {voice.maxFadeIn}
        onChange= {(e: any) => updateVoice(e, 'maxFadeIn')}
        maxLength= {4}
      />
    ],
    fadeOut: [
      <Input
        className= 'textbox'
        title= 'Min Fade Out'
        label= 'Fade Out'
        id= {`minFadeOut${i}`}
        i={i}
        type= "number"
        value= {voice.minFadeOut}
        onChange= {(e: any) => updateVoice(e, 'minFadeOut')}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'Max Fade Out'
        label= 'Fade Out'
        id= {`maxFadeOut${i}`}
        i={i}
        type= "number"
        value= {voice.maxFadeOut}
        onChange= {(e: any) => updateVoice(e, 'maxFadeOut')}
        maxLength= {4}
      />
    ],
    notes: allNotes.map((note, j) => {
      return <Input
        className= {`note${i}`}
        title= {note.toString()}
        type= "checkbox"
        value= {note}
        checked= {voice.activeNotes?.includes(note)}
        onChange= {(e: any) => updateCheckbox(e, 'activeNotes')}
      />
    }),
    octaves: allOctaves.map((octave, j) => {
      return <Input
        className= {`octave${i}`}
        title= {octave.toString()}
        type= "checkbox"
        value= {octave}
        checked= {voice.activeOctaves.includes(octave)}
        onChange= {(e: any) => updateCheckbox(e, 'activeOctaves')}
      />
    }),
    waveShapes: allWaveShapes.map((waveShape, j) => {
      return <Input
        className= {`wave${i}`}
        title= {waveShape}
        type= "checkbox"
        value= {waveShape}
        checked= {voice.activeWaveShapes.includes(waveShape)}
        onChange= {(e: any) => updateCheckbox(e, 'activeWaveShapes')}
      />
    }),
    intervals: allIntervals.map((interval, j) => {
      return <Input
        className= {`interval${i}`}
        title= {interval.toString()}
        type= "checkbox"
        value= {interval}
        checked= {voice.activeIntervals.includes(interval)}
        onChange= {(e: any) => updateCheckbox(e, 'activeIntervals')}
      />
    })
  }

  return <div 
    className="voice" 
    id={`voice${i}`}
    data-testid={`voice-${i}`}
    key={`voice-${i}`}
  >
    <div className="row">
      <div className="column">
        {
          Object.keys(attributes).map(attribute => 
            <div className="row inner-row">
              {
                attributes[attribute].map((input: any) =>
                  input
                )
              }
            </div>
          )
        }
      </div>
      <button 
        id="delete-voice"
        onClick={(e) => handleDelete(i, e)}
        data-testid={`delete-voice-${i}`}
      >
        X
      </button>
    </div>
  </div>
}