import Piano from "../Piano/Piano";
import { updateButton } from "../shared.functions";
import { VoiceType }    from "../shared.types";

export default function VoicePiano ({

  voices,
  i,
  setVoices

} : {
  
  voices    : VoiceType[]
  i         : number
  setVoices : React.Dispatch<React.SetStateAction<VoiceType[]>>

}) {

  const whiteKeys = [1, 3, 5, 6, 8, 10, 12, 13]
  const blackKeys = [2, 4, 7, 9, 11]

  const keys = [
    ...whiteKeys, 
    ...blackKeys
  ].sort((a, b) => +b - +a)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateButton(e, 'activeNotes', voices, i, setVoices)
  }
  
  return (
    <Piano
      voices={voices}
      i={i}
      handleClick={handleClick}
      keys={keys}
    />
  )
}
