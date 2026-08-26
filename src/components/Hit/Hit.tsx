import { useState } from "react"
import { HitType, VoiceType } from "../shared.types"
import HitDetails from "../HitDetails/HitDetails"

export default function Hit({

  frequencies,
  pixelsPerSecond,
  key,
  hit,
  voices,
  frequencyToPixels

} : {

  frequencies: number[]
  pixelsPerNote: number
  pixelsPerSecond: number
  key: number
  hit: HitType
  voices: VoiceType[]
  frequencyToPixels: (frequency: number) => number

}) {

  const [showDetails, setShowDetails] = useState(false)

  const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => setShowDetails(false)

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setShowDetails(!showDetails)
  }

  const pianoKey = document.getElementById(
    `timeline-grid-piano-${hit.frequency}`
  )

  const top = pianoKey?.offsetTop ?? 0

  console.log(hit)
  console.log(pianoKey)

  return <>
    <div
      key={key}
      className="hit"
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      style={{
        top,
        left: hit.startTime * pixelsPerSecond,
        width: (hit.endTime - hit.startTime) * pixelsPerSecond,
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