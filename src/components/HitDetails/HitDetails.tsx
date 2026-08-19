import { noteNameToIndex, noteNumberToLetter } from "../../content/data"
import { HitType } from "../shared.types"

export default function HitDetails({
  hit
} : {
  hit: HitType
}) {

  console.log(hit)
  
  const { 
    sound, 
    level,
    note,
    octave,
    detune,
    startTime,
    endTime,
    peakStart,
    peakEnd
  } = hit
  
  return <div className="component-border hit-details">
    <div>{sound}</div>
    <div>{`${noteNumberToLetter[note!]}${octave}`}</div>
    <div>Level - {level}</div>
    <div>Detune - {detune}</div>
    <div>Start - {startTime}</div>
    <div>
      {
        peakStart !== startTime ? `
          Peak - ${peakStart}  
          ${
            peakStart === peakEnd ? '' : ` - ${peakEnd}`
          }
        ` : `` 
      }
    </div>
    <div>End - {endTime}</div>
  </div>
}