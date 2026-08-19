import { useState } from "react"
import { HitType, VoiceType } from "../shared.types"
import HitDetails from "../HitDetails/HitDetails"

export default function Hit({

  frequencies,
  pixelsPerNote,
  pixelsPerSecond,
  key,
  hit,
  voices

} : {

  frequencies: number[]
  pixelsPerNote: number
  pixelsPerSecond: number
  key: number
  hit: HitType
  voices: VoiceType[]

}) {

  const [showDetails, setShowDetails] = useState(false)

  const handleClick = () => setShowDetails(!showDetails)

  const frequencyToPixels = (frequency: number) => {
  
    let closestIndex = 0
    let closestDifference = Infinity

    frequencies.forEach((noteFrequency, index) => {

      const difference = Math.abs(noteFrequency - frequency)

      if (difference < closestDifference) {
        closestDifference = difference
        closestIndex = index
      }
    })

    return (frequencies.length - 1 - closestIndex) * pixelsPerNote
  }



  return <>
    <div
      key={key}
      className="hit"
      onClick={handleClick}
      style={{
        left: hit.startTime! * pixelsPerSecond,
        bottom: frequencyToPixels(hit.frequency!) + 1,
        width: Math.max(
          (hit.endTime! - hit.startTime!) *
          pixelsPerSecond,
          3
        ),
        height: pixelsPerNote - 2,
        backgroundColor: voices.filter(voice => voice.id === hit.voiceId)[0].colour
      }}
    >
      {
        showDetails ? <>
          <HitDetails
            hit={hit}
          />
        </> : <></>
      }
    </div>
  </>
}