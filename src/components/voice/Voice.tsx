import { VoiceProps, CheckboxGroup, Scalar } from '../../types/voice'
import {checkboxGroups} from '../../content/data'
import Input from '../input/Input'
import { updateField, updateCheckbox } from './functions'

export default function Voice(
  {
    voice, 
    i, 
    voices,  
    handleDelete,
    setVoices
  }: VoiceProps
) {

  const extrema = ['Min', 'Max']

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
        onChange= {(e: any) => updateField(e, 'label', voices, i, setVoices)}
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
        onChange= {(e: any) => updateField(e, 'bpm', voices, i, setVoices)}
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
        onChange= {(e: any) => updateField(e, 'rest', voices, i, setVoices)}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ],
    level: extrema.map((input, j) => 
      <Input
        className= 'textbox'
        title={`${input} Level`}
        label={j ? '' : 'Level'}
        id= {`${input.toLowerCase()}Level${i}`}
        i={i}
        type= "number"
        value= {voice[`${input.toLowerCase()}Level` as Scalar]}
        onChange= {(e: any) => updateField(e, `${input.toLowerCase()}Level` as Scalar, voices, i, setVoices)}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ),
    length: extrema.map((input, j) =>
      <Input
        className= 'textbox'
        title={`${input} Length`}
        label={j ? '' : 'Length'}
        id= {`${input.toLowerCase()}Length${i}`}
        i={i}
        type= "number"
        value= {voice[`${input.toLowerCase()}Length` as Scalar]}
        onChange= {(e: any) => updateField(e, `${input.toLowerCase()}Length` as Scalar, voices, i, setVoices)}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ),
    offset: extrema.map((input, j) =>
      <Input
        className= 'textbox'
        title={`${input} Offset`}
        label={j ? '' : 'Offset'}
        id= {`${input.toLowerCase()}Offset${i}`}
        i={i}
        type= "number"
        value= {voice[`${input.toLowerCase()}Offset` as Scalar]}
        onChange= {(e: any) => updateField(e, `${input.toLowerCase()}Offset` as Scalar, voices, i, setVoices)}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ),
    detune: extrema.map((input, j) =>
      <Input
        className= 'textbox'
        title={`${input} Detune`}
        label={j ? '' : 'Detune'}
        id= {`${input.toLowerCase()}Detune${i}`}
        i={i}
        type= "number"
        value= {voice[`${input.toLowerCase()}Detune` as Scalar]}
        onChange= {(e: any) => updateField(e, `${input.toLowerCase()}Detune` as Scalar, voices, i, setVoices)}
        min= {-100}
        max= {100}
        maxLength= {4}
      />
    ),
    fadeIn: [
      <Input
        className= 'textbox'
        title= 'Min Fade In'
        label= 'Fade In'
        id= {`minFadeIn${i}`}
        i={i}
        type= "number"
        value= {voice.minFadeIn}
        onChange= {(e: any) => updateField(e, 'minFadeIn', voices, i, setVoices)}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'Max Fade In'
        id= {`maxFadeIn${i}`}
        i={i}
        type= "number"
        value= {voice.maxFadeIn}
        onChange= {(e: any) => updateField(e, 'maxFadeIn', voices, i, setVoices)}
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
        onChange= {(e: any) => updateField(e, 'minFadeOut', voices, i, setVoices)}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'Max Fade Out'
        id= {`maxFadeOut${i}`}
        i={i}
        type= "number"
        value= {voice.maxFadeOut}
        onChange= {(e: any) => updateField(e, 'maxFadeOut', voices, i, setVoices)}
        maxLength= {4}
      />
    ],
    checkboxGroups: [
      <div className="column">
        {
          Object.keys(checkboxGroups).map(checkboxGroup =>
            <>
              <div className="row">
                <div className="label">{checkboxGroup}</div>
                {
                  checkboxGroups[checkboxGroup as CheckboxGroup].map((checkbox: string, j: number) => {
                    return <Input
                      className= {`${checkboxGroup}${i}`}
                      title= {checkbox}
                      type= "checkbox"
                      value= {checkbox}
                      checked= {voice[`active${checkboxGroup as CheckboxGroup}`].includes(checkbox)}
                      onChange= {(e: any) => updateCheckbox(e, `active${checkboxGroup as CheckboxGroup}`, voices, i, setVoices)}
                    />
                  })
                }
              </div>
            </>
          )
        }
      </div>
    ]
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