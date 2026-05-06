import { checkboxGroups, extrema, fields } from "../../content/data";
import { InputsProps } from "../../types/inputs";
import { Atom, CheckboxGroup } from "../../types/voice";
import Input from "../input/Input";
import { updateCheckbox, updateField } from "../voice/functions";

const input = ((props: any) => {
  return <>
    <Input
      {...props}
    />
  </>
})

export default function Inputs(
  { 
    i,
    voice,
    voices,
    setVoices
  }: InputsProps) {

  const inputs: any = {
    fields: <>
      <div className="column">
        {
          Object.keys(fields).map(field => {

            const f = fields[field as keyof typeof fields]

            const props: any = {
              className: 'textbox',
              'data-voice': i,
              'data-attribute': `${f.value}`,
              type: 'number',
              value: voice[`${f.value}` as Atom],
              onChange: (e: any) => updateField(e, `${f.value}` as Atom, voices, i, setVoices)
            }

            return <>
              <div className="row">
                <div className="label">{f.label}</div>
                {
                  f.input === 'range' ? <>
                    {
                      extrema.map((ex) => {

                        props['data-attribute'] = `${ex}${f.value}`;
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
                      className: 'checkbox',
                      'data-attribute': checkboxGroup,
                      'data-voice': i,
                      type: "checkbox",
                      value: checkbox,
                      checked: voice[`active${checkboxGroup as CheckboxGroup}`].includes(checkbox),
                      onChange: (e: any) => updateCheckbox(e, `active${checkboxGroup as CheckboxGroup}`, voices, i, setVoices)
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

  return <>
    <div className="column">
      {
        Object.keys(inputs).map(input => 
          <div className="row">
            {inputs[input]}
          </div>
        )
      }
    </div>
  </>
}