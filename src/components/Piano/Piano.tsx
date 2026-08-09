import { updateButton } from "../shared.functions";
import { VoiceType }    from "../shared.types";

export default function Piano ({

  voices,
  i,
  setVoices

} : {
  
  voices    : VoiceType[]
  i         : number
  setVoices : React.Dispatch<React.SetStateAction<VoiceType[]>>

}) {

  const voice = voices[i]

  const whiteKeys = ['1', '3', '5', '6', '8', '10', '12', '13']
  const blackKeys = ['2', '4', '7', '9', '11']

  const keys = [
    ...whiteKeys, 
    ...blackKeys
  ].sort((a, b) => +b - +a)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateButton(e, 'activeNotes', voices, i, setVoices)
  }
  
  return (
    <div className="parent">
      <div className="button-grid keyboard">
        {
          keys.map(key => {

            const colour = blackKeys.includes(key) ? 'black' : 'white'
            const active = voice.activeNotes.includes(key) ? 'active' : ''
            const checked = Boolean(active)

            const props = {
              className         : `${active} ${colour} key`,
              'data-attribute'  : 'Notes',
              'data-voice'      : i,
              value             : key,
              checked           : checked,
              onClick           : handleClick,
              id              : `voice-${i}-note-${key}`
            };

            return <button {...props} key={key} />
          })
        }
      </div>
    </div>
  )
}
