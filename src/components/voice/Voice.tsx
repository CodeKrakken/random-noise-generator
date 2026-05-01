import { VoiceProps, CheckboxGroup, Atom, AtomicField } from '../../types/voice'
import {checkboxGroups, extrema, fields} from '../../content/data'
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

  const input = ((field: any, ex: string = '') => {

    return <>
      <Input
        className= 'textbox' // sets the width of the input box
        title={`${ex}${field.value}`} // tests grab element
        id= {`${ex}${field.value}${i}`} // code grabs element 
        i={i} // does nothing
        type= "number" // does nothing
        value= {voice[`${ex}${field.value}` as Atom]} // populates field
        onChange= {(e: any) => updateField(e, `${ex}${field.value}` as Atom, voices, i, setVoices)} // updates field
        maxLength= {4} // does nothing
        {...field.attribs} // currently does nothing
      />
    </>
  })

  const inputs: any = {
    fields: <>
      <div className="column">
        {
          Object.keys(fields).map(field => 
            <div className="row">
              <div className="label">{fields[field as keyof typeof fields].label}</div>
              {
                fields[field as keyof typeof fields].input === 'range' ? <>
                  {
                    extrema.map((ex, j) => 
                      input(fields[field as keyof typeof fields], ex)
                    )
                  }
                </> : <>
                  {
                    input(fields[field as keyof typeof fields])
                  }
                </>
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
                  checkboxGroups[checkboxGroup as CheckboxGroup].map((checkbox: string) => {
                    return <Input
                      className= {`${checkboxGroup}${i}`} // code and tests grab element
                      title= {checkbox} // one test grabs element
                      type= "checkbox" // makes it be a checkbox
                      value= {checkbox} // code grabs element for playback and update 
                      checked= {voice[`active${checkboxGroup as CheckboxGroup}`].includes(checkbox)} // populates checks
                      onChange= {(e: any) => updateCheckbox(e, `active${checkboxGroup as CheckboxGroup}`, voices, i, setVoices)} // updates checks
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