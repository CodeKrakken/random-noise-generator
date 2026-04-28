import { VoiceProps, CheckboxGroup, Atom } from '../../types/voice'
import {checkboxGroups, ranges, extrema } from '../../content/data'
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
    atoms: <>
      <div className="column">
        {
          [
            {
              className: 'textbox',
              title: "Label",
              label: "Name",
              id: `label${i}`,
              i: i,
              type: "text",
              value: voice.label,
              onChange: (e: any) => updateField(e, 'label', voices, i, setVoices)
            },
            {
              className: 'textbox',
              title: "BPM",
              label: "BPM",
              id: `bpm${i}`,
              i: i,
              type: "number",
              value: voice.bpm,
              onChange: (e: any) => updateField(e, 'bpm', voices, i, setVoices),
              maxLength: 5,
              min: 0,
              max: 60000
            },
            {
              className: 'textbox',
              title: "Rest %",
              label: "Rest %",
              id: `rest${i}`,
              i: i,
              type: "number",
              value: voice.rest,
              onChange: (e: any) => updateField(e, 'rest', voices, i, setVoices),
              min: 0,
              max: 100,
              maxLength: 3
            }
          ].map(single => {
            const {
              className,
              title,
              label,
              id,
              type,
              value,
              onChange,
              min,
              max,
              maxLength
            } = single

            return <>
              <Input
                className= {className}
                title= {title}
                label= {label}
                id= {id}
                i={i}
                type={type}
                value= {value}
                onChange= {onChange}
                min= {min}
                max= {max}
                maxLength= {maxLength}
              />
            </>
          })
        }
      </div>
    </>,
    ranges: <> 
      <div className="column">
        {
          ranges.map(range =>
            <div className="row">
              {
                extrema.map((input, j) =>
                  <Input
                    className= 'textbox'
                    title={`${input} ${range}`}
                    label={j ? '' : range}
                    id= {`${input.toLowerCase()}${range}${i}`}
                    i={i}
                    type= "number"
                    value= {voice[`${input.toLowerCase()}${range}`]}
                    onChange= {(e: any) => updateField(e, `${input.toLowerCase()}${range}` as Atom, voices, i, setVoices)}
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