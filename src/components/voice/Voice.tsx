import { VoiceProps, CheckboxGroup, Scalar } from '../../types/voice'
import {checkboxGroups} from '../../content/data'
import Input from '../input/Input'
import { updateAttribute, updateCheckbox, updateVoice } from './functions'

export default function Voice(
  {
    voice, 
    i, 
    voices,  
    handleDelete,
    setVoices
  }: VoiceProps
) {



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
        onChange= {(e: any) => updateAttribute(e, 'label', voices, i, updateVoice)}
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
        onChange= {(e: any) => updateAttribute(e, 'bpm', voices, i, updateVoice)}
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
        onChange= {(e: any) => updateAttribute(e, 'rest', voices, i, updateVoice)}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ],
    level: ['Min', 'Max'].map((input, j) => 
      <Input
        className= 'textbox'
        title={`${input} Level`}
        label={j ? '' : 'Level'}
        id= {`${input.toLowerCase()}Level${i}`}
        i={i}
        type= "number"
        value= {voice[`${input.toLowerCase()}Level` as Scalar]}
        onChange= {(e: any) => updateAttribute(e, `${input.toLowerCase()}Level` as Scalar, voices, i, updateVoice)}
        min= {0}
        max= {100}
        maxLength= {3}
      />
    ),
    length: [
      <Input
        className= 'textbox'
        title= 'Min Length'
        label= 'Length'
        id= {`minLength${i}`}
        i={i}
        type= "number"
        value= {voice.minNoteLength}
        onChange= {(e: any) => updateAttribute(e, 'minNoteLength', voices, i, updateVoice)}
        min= {0}
        max= {100}
        maxLength= {3}
      />,
      <Input
        className= 'textbox'
        title= 'Max Length'
        id= {`maxLength${i}`}
        i={i}
        type= "number"
        value= {voice.maxNoteLength}
        onChange= {(e: any) => updateAttribute(e, 'maxNoteLength', voices, i, updateVoice )}
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
        onChange= {(e: any) => updateAttribute(e, 'minOffset', voices, i, updateVoice)}
        min= {0}
        max= {100}
        maxLength= {3}
      />,
      <Input
        className= 'textbox'
        title= 'Max Offset'
        id= {`maxOffset${i}`}
        i={i}
        type= "number"
        value= {voice.maxOffset}
        onChange= {(e: any) => updateAttribute(e, 'maxOffset', voices, i, updateVoice)}
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
        onChange= {(e: any) => updateAttribute(e, 'minDetune', voices, i, updateVoice)}
        min= {-100}
        max= {100}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'detune'
        id= {`maxDetune${i}`}
        i={i}
        type= "number"
        value= {voice.maxDetune}
        onChange= {(e: any) => updateAttribute(e, 'maxDetune', voices, i, updateVoice)}
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
        onChange= {(e: any) => updateAttribute(e, 'minFadeIn', voices, i, updateVoice)}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'Max Fade In'
        id= {`maxFadeIn${i}`}
        i={i}
        type= "number"
        value= {voice.maxFadeIn}
        onChange= {(e: any) => updateAttribute(e, 'maxFadeIn', voices, i, updateVoice)}
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
        onChange= {(e: any) => updateAttribute(e, 'minFadeOut', voices, i, updateVoice)}
        maxLength= {4}
      />,
      <Input
        className= 'textbox'
        title= 'Max Fade Out'
        id= {`maxFadeOut${i}`}
        i={i}
        type= "number"
        value= {voice.maxFadeOut}
        onChange= {(e: any) => updateAttribute(e, 'maxFadeOut', voices, i, updateVoice)}
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