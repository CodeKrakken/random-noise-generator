import { noteNameToIndex } from "../../content/data";
import { updateButton } from "../shared.functions";
import { VoiceType }    from "../shared.types";

export default function Piano ({

  voices,
  i,
  handleClick,
  keys,
  props

} : {
  
  voices?       : VoiceType[]
  i?            : number
  handleClick?  : React.MouseEventHandler<HTMLButtonElement>
  keys          : number[]
  props         : { [key: string]: string }
}) {

  const id = props.id

  let voice: VoiceType

  if (voices) voice = voices[i!]

  const getNoteName = (index: number) => {
    const noteNames = Object.keys(noteNameToIndex)
    const noteName = noteNames[index % 12]
    return noteName
  }
  
  return (
    <div className="button-grid-parent">
      <div 
        className="button-grid piano" 
        {...props}
      >
        {
          keys.map((key, i) => {

            console.log(key)
            console.log(i)
            const colour = getNoteName(i).includes('b') ? 'black' : 'white'
            const active = voice?.activeNotes.includes(String(key)) ? 'active' : ''
            const checked = Boolean(active)

            const props = {
              className : `${active} ${colour} key`,
              value     : key,
              checked   : checked,
              onClick   : handleClick,
              id        : `${id}-${key}`,
            };
            
            return <button {...props} key={key} />
          })
        }
      </div>
    </div>
  )
}
