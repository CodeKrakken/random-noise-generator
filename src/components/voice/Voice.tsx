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

  const input = ((props: any) => {

    return <>
      <Input
        {...props}
      />
    </>
  })

  const inputs: any = {
    fields: <>
      <div className="column">
        {
          Object.keys(fields).map(field => {
            const f = fields[field as keyof typeof fields]

            const props: any = {
              className: 'textbox', // sets the width of the input box
              title:`${f.value}`, // tests grab element
              id: `${f.value}${i}`, // code grabs element 
              value: voice[`${f.value}` as Atom], // populates field
              onChange: (e: any) => updateField(e, `${f.value}` as Atom, voices, i, setVoices), // updates field
              type: 'number'
            }

            return <>
              <div className="row">
                <div className="label">{f.label}</div>
                {
                  f.input === 'range' ? <>
                    {
                      extrema.map((ex) => {

                        props.title = `${ex}${f.value}` // tests grab element
                        props.id = `${ex}${f.value}${i}` // code grabs element 
                        props.value = voice[`${ex}${f.value}` as Atom] // populates field
                        props.onChange = (e: any) => updateField(e, `${ex}${f.value}` as Atom, voices, i, setVoices) // updates field

                        return input(props);
                      })
                    }
                  </> : <>
                    {
                      input(props)
                    }
                  </>
                }
              </div>
            </>
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

                    const props: any = {
                      className: `${checkboxGroup}${i}`, // code and tests grab element
                      title: checkbox, // one test grabs element
                      type: "checkbox", // makes it be a checkbox
                      value: checkbox, // code grabs element for playback and update 
                      checked: voice[`active${checkboxGroup as CheckboxGroup}`].includes(checkbox), // populates checks
                      onChange: (e: any) => updateCheckbox(e, `active${checkboxGroup as CheckboxGroup}`, voices, i, setVoices) // updates checks
                    };
                    return input(props)
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