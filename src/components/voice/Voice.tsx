import { VoiceProps, CheckboxGroup, Atom, AtomicField } from '../../types/voice'
import {checkboxGroups, rangeFields, extrema} from '../../content/data'
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

  const atomicFields = {
    label: {
      title: "Label",
      label: "Name",
      id: `label${i}`,
      i: i,
      type: "text",
      value: voice.label,
      onChange: (e: any) => updateField(e, 'label', voices, i, setVoices)
    },
    bpm: {
      title: "BPM",
      label: "BPM",
      id: `bpm${i}`,
      i:i,
      type: "number",
      value: voice.bpm,
      onChange: (e: any) => updateField(e, 'bpm', voices, i, setVoices),
      maxLength: 5,
      min: 0,
      max: 60000
    },
    restChance: {
      title: 'Rest %',
      label: 'Rest %',
      id: `rest${i}`,
      i:i,
      type: "number",
      value: voice.rest,
      onChange: (e: any) => updateField(e, 'rest', voices, i, setVoices),
      min: 0,
      max: 100,
      maxLength: 3
    }
  }

  const inputs: any = {
    atomicFields: <> 
      <div className="column">
        {
          Object.keys(atomicFields).map(field =>
            <div className="row">
              <Input 
                className= "textbox"  
                {...atomicFields[field as AtomicField]}
              />
            </div>
          )
        }
      </div>
    </>,
    rangeFields: <> 
      <div className="column">
        {
          rangeFields.map(field =>
            <div className="row">
              {
                extrema.map((input, j) =>
                  <Input
                    className= 'textbox'
                    title={`${input} ${field}`}
                    label={j ? '' : field}
                    id= {`${input.toLowerCase()}${field}${i}`}
                    i={i}
                    type= "number"
                    value= {voice[`${input.toLowerCase()}${field}` as Atom]}
                    onChange= {(e: any) => updateField(e, `${input.toLowerCase()}${field}` as Atom, voices, i, setVoices)}
                    maxLength= {4}
                  />
                )
              }
            </div>
          )
        }
      </div>
    </>,
    checkboxGroups: <>
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
    </> 
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
          Object.keys(inputs).map(input => 
            <div className="row">
              {inputs[input]}
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