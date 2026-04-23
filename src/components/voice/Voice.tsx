import { voice } from '../../types/voice'

type props = {
  voice        : voice, 
  i           : number, 
  setVoices    : Function, 
  voices       : voice[], 
  handleDelete: Function
}

const ranges = [
  'Level',
  'NoteLength',
  'Offset',
  'Detune',
  'FadeIn',
  'FadeOut',
] as const

type Range = typeof ranges[number]

type VoiceAttribute =
| 'label'
| 'bpm'
| 'rest'
| `min${Range}`
| `max${Range}`

const allNotes   = [1,2,3,4,5,6,7,8,9,10,11,12,13]
const allOctaves  = [0,1,2,3,4,5,6,7,8,9,10]
const allWaveShapes = [
  'sine',
  'triangle',
  'sawtooth',
  'square',
  'kick',
  'snare'
]

const allIntervals = [1, 1/2, 1/4, 1/8, 1/16]

export default function Voice(props: props) {

  const updateVoice = (e: any, attribute: VoiceAttribute) => {
    voices[i][attribute] = +e.target!.value
    setVoices([voices.slice(0,i), voices[i], voices.slice(i+1)].flat())
  } 

  const {
    voice, 
    i, 
    setVoices, 
    voices,  
    handleDelete
  } = props

  const attributes: any = {
    label: [
      {
        className: 'textbox',  
        title: "Label",
        label: "Name",
        id: `label${i}`,
        'data-testid': `voice-label-${i}`,
        type: "text",
        value: voice.label,
        onChange: (e: any) => updateVoice(e, 'label')
      }
    ],
    bpm: [
      {
        className: 'textbox',
        title: "BPM",
        label: "BPM",
        id: `bpm${i}`,
        type: "number",
        value: voice.bpm,
        onChange: (e: any) => updateVoice(e, 'bpm'),
        maxLength: 5,
        min: 0,
        max: 60000
      }
    ],
    restChance: [
      {
        className: 'textbox',
        title: 'Rest %',
        label: 'Rest %',
        id: `rest${i}`,
        type: "number",
        value: voice.rest,
        onChange: (e: any) => updateVoice(e, 'rest'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    level: [
      {
        className: 'textbox',
        title: 'Min Level',
        label: 'Level',
        id: `minLevel${i}`,
        type: "number",
        value: voice.minLevel,
        onChange: (e: any) => updateVoice(e, 'minLevel'),
        min:0,
        max:100,
        maxLength:3
      },
      {
        className: 'textbox',
        title: 'Max Level',
        id: `maxLevel${i}`,
        type: "number",
        value: voice.maxLevel,
        onChange: (e: any) => updateVoice(e, 'maxLevel'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    length: [
      {
        className: 'textbox',
        title: 'Min Length',
        label: 'Length',
        id: `minLength${i}`,
        type: "number",
        value: voice.minNoteLength,
        onChange: (e: any) => updateVoice(e, 'minNoteLength'),
        min:0,
        max:100,
        maxLength:3
      },
      {
        className: 'textbox',
        title: 'Max Length',
        id: `maxLength${i}`,
        type: "number",
        value: voice.maxNoteLength,
        onChange: (e: any) => updateVoice(e, 'maxNoteLength'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    offset: [
      {
        className: 'textbox',
        title: 'Min Offset',
        label: 'Offset',
        id: `minOffset${i}`,
        type: "number",
        value: voice.minOffset,
        onChange: (e: any) => updateVoice(e, 'minOffset'),
        min:0,
        max:100,
        maxLength:3
      },
      {
        className: 'textbox',
        title: 'Max Offset',
        id: `maxOffset${i}`,
        type: "number",
        value: voice.maxOffset,
        onChange: (e: any) => updateVoice(e, 'maxOffset'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    detune: [
      {
        className: 'textbox',
        title: 'detune',
        label: 'Detune',
        id: `minDetune${i}`,
        type: "number",
        value: voice.minDetune,
        onChange: (e: any) => updateVoice(e, 'minDetune'),
        min:-100,
        max:100,
        maxLength:4
      },
      {
        className: 'textbox',
        title: 'detune',
        id: `maxDetune${i}`,
        type: "number",
        value: voice.maxDetune,
        onChange: (e: any) => updateVoice(e, 'maxDetune'),
        min:-100,
        max:100,
        maxLength:4
      }
    ],
    fadeIn: [
      {
        className: 'textbox',
        title: 'Min Fade In',
        label: 'Fade In',
        id: `minFadeIn${i}`,
        type: "number",
        value: voice.minFadeIn,
        onChange: (e: any) => updateVoice(e, 'minFadeIn'),
        maxLength:4
      },
      {
        className: 'textbox',
        title: 'Max Fade In',
        id: `maxFadeIn${i}`,
        type: "number",
        value: voice.maxFadeIn,
        onChange: (e: any) => updateVoice(e, 'maxFadeIn'),
        maxLength:4
      }
    ],
    fadeOut: [
      {
        className: 'textbox',
        title: 'Min Fade Out',
        label: 'Fade Out',
        id: `minFadeOut${i}`,
        type: "number",
        value: voice.minFadeOut,
        onChange: (e: any) => updateVoice(e, 'minFadeOut'),
        maxLength:4
      },
      {
        className: 'textbox',
        title: 'Max Fade Out',
        id: `maxFadeOut${i}`,
        type: "number",
        value: voice.maxFadeOut,
        onChange: (e: any) => updateVoice(e, 'maxFadeOut'),
        maxLength:4
      }
    ],
    notes: allNotes.map((note, j) => {
      return {
        className: `note${i}`,
        title: note.toString(),
        type: "checkbox",
        value: note,
        checked: voice.activeNotes?.includes(note),
        onChange: (e: any) => setVoices([voices.slice(0,i), {...voices[i], activeNotes: voice.activeNotes.includes(+e.target.value) ? voice.activeNotes.filter(note => note !== +e.target.value) : [voice.activeNotes, +e.target.value].flat()}, voices.slice(i+1)].flat())
      }
    }),
    octaves: allOctaves.map((octave, j) => {
      return {
        className: `octave${i}`,
        title: octave.toString(),
        type: "checkbox",
        value: octave,
        checked: voice.activeOctaves.includes(octave),
        onChange: (e: any) => setVoices([voices.slice(0,i), {...voices[i], activeOctaves: voice.activeOctaves.includes(+e.target.value) ? voice.activeOctaves.filter(note => note !== +e.target.value) : [voice.activeOctaves, +e.target.value].flat()}, voices.slice(i+1)].flat())
      }
    }),
    waveShapes: allWaveShapes.map((waveShape, j) => {
      return {
        title: waveShape,
        className: `wave${i}`,
        type: "checkbox",
        value: waveShape,
        checked: voice.activeWaveShapes.includes(waveShape),
        onChange: (e: any) => setVoices([voices.slice(0,i), {...voices[i], activeWaveShapes: voice.activeWaveShapes.includes(e.target.value) ? voice.activeWaveShapes.filter(waveShape => waveShape !== e.target.value) : [voice.activeWaveShapes, e.target.value].flat()}, voices.slice(i+1)].flat())
      }
    }),
    intervals: allIntervals.map((interval, j) => {
      return {
        className: `interval${i}`,
        title: interval.toString(),
        type: "checkbox",
        value: interval,
        checked: voice.activeIntervals.includes(interval),
        onChange: (e: any) => setVoices([voices.slice(0,i), {...voices[i], activeIntervals: voice.activeIntervals.includes(+e.target.value) ? voice.activeIntervals.filter(interval => interval !== +e.target.value) : [voice.activeIntervals, +e.target.value].flat()}, voices.slice(i+1)].flat())
      }
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
                attributes[attribute].map((input: any) => {

                const {
                  title,
                  label,
                  className,
                  id,
                  type,
                  value,
                  onChange,
                  maxLength,
                  min,
                  max,
                  checked
                } = input

                const dataTestId = input['data-testid']

                return (
                  <>
                    {
                      label && <div className="label">
                        {label}
                      </div>
                    }
                    <div>
                      <input 
                        className={className}
                        title={title}
                        id={id}
                        data-testid={dataTestId}
                        type={type} 
                        value={value}
                        onChange={onChange}
                        maxLength={maxLength}
                        min={min}
                        max={max}
                        checked={checked}
                      />
                    </div>
                  </>
                )
                })
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