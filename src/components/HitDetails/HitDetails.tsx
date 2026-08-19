import { noteNameToIndex, noteNumberToLetter } from "../../content/data"
import { HitType } from "../shared.types"

export default function HitDetails({
  hit
} : {
  hit: HitType
}) {
  
  const { 
    sound, 
    level,
    note,
    octave  
  } = hit
  
  return <div className="component-border hit-details">
    <div>{sound}</div>
    <div>Level - {level}</div>
    <div>Note{`${noteNumberToLetter[note!]}${octave}`}</div>

  </div>
}