import { noteNameToIndex } from "../../content/data";
import { updateButton } from "../shared.functions";
import { VoiceType }    from "../shared.types";

export default function Piano ({

  voices,
  i,
  handleClick,
  keys

} : {
  
  voices      : VoiceType[]
  i           : number
  handleClick : React.MouseEventHandler<HTMLButtonElement>
  keys        : string[]

}) {

  const voice = voices[i]

  const getNoteName = (index: number) => {

    const noteNames = Object.keys(noteNameToIndex)

    return noteNames[index % 12]
  }


  
  return (
    <div className="parent">
      <div className="button-grid piano">
        {
          keys.map((key, i) => {

            const colour = getNoteName(i).includes('b') ? 'black' : 'white'
            const active = voice.activeNotes.includes(key) ? 'active' : ''
            const checked = Boolean(active)

            const props = {
              className : `${active} ${colour} key`,
              value     : key,
              checked   : checked,
              onClick   : handleClick,
              id        : `voice-${i}-note-${key}`
            };

            return <button {...props} key={key} />
          })
        }
      </div>
    </div>
  )
}
