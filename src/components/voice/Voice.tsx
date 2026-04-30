import { VoiceProps, CheckboxGroup, Atom, AtomicField } from '../../types/voice'
import {checkboxGroups, rangeFields, atomicFields, extrema, fields} from '../../content/data'
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

  const inputs: any = {
    fields: <>
      <div className="column">
        {
          Object.keys(fields).map(field => {
            return <div className="row">
              {
                fields[field as keyof typeof fields].type === 'atom' ? (
                  <Input 
                    className= "textbox"
                    title={field}
                    i={i}
                    type="number"
                    id={`${field}${i}`}
                    value={voice[field as Atom]}
                    onChange= {(e: any) => updateField(e, field as AtomicField, voices, i, setVoices)}
                    {...atomicFields[field as AtomicField]}
                  />
                ) : (
                  <>
                    {
                      extrema.map((ex, j) => 
                        <Input
                          className= 'textbox'
                          title={`${ex}${fields[field as keyof typeof fields].label}`}
                          label={j ? '' : fields[field as keyof typeof fields].label}
                          id= {`${ex}${fields[field as keyof typeof fields].label}${i}`}
                          i={i}
                          type= "number"
                          value= {voice[`${ex}${fields[field as keyof typeof fields].label}` as Atom]}
                          onChange= {(e: any) => updateField(e, `${ex}${fields[field as keyof typeof fields].label}` as Atom, voices, i, setVoices)}
                          maxLength= {4}
                        />
                      )
                    }
                  </>
                )
              }
            </div>
          })
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
                  checkboxGroups[checkboxGroup as CheckboxGroup].map((checkbox: string) => {
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