import { checkboxGroups, extrema, fields } from "../../content/data";
import { InputsProps } from "./Inputs.types";
import { Atom, CheckboxGroup } from "../shared.types";
import Input from "../Input/Input";
import { updateCheckbox, updateField } from "../Voice/functions";
import { InputProps } from "../Input/Input.types";

const input = ((props: InputProps) => {
  return <>
    <Input
      {...props}
    />
  </>
})

export default function Inputs(
  { 
    i,
    voices,
    setVoices
  }: InputsProps) {

  const voice = voices[i]

  const inputs: any = {
    fields: <>
      <div className="column">
        {
          Object.keys(fields).map(field => {

            const f = fields[field as keyof typeof fields]

            const props: InputProps = {
              className: 'textbox',
              'data-voice': i,
              'data-attribute': `${f.value}`,
              type: 'number',
              value: voice[`${f.value}` as Atom],
              onChange: (e: React.ChangeEvent) => updateField(e, f.value as Atom, voices, i, setVoices)
            }

            return <>
              <div 
                className="row" 
                key={field}
              >
                <div className="label">{f.label}</div>
                {
                  f.input === 'range' ? <>
                    {
                      extrema.map((ex) => {

                        props['data-attribute'] = `${ex}${f.value}`;
                        props.value = voice[`${ex}${f.value}` as Atom] // populates field
                        props.onChange = (e: React.ChangeEvent) => updateField(e, `${ex}${f.value}` as Atom, voices, i, setVoices) // updates field
                        
                        return <>
                          <div key={ex}>
                            {input(props)}
                          </div>
                        </>
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

                    console.log(checkboxGroup)

                    const props: InputProps = {
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
    <div 
      className="column"
    >
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