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
  key: string
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
  
  const whiteKey = document.getElementById(
    `timeline-grid-piano-16.35`
  )

  const blackKey = document.getElementById(
    `timeline-grid-piano-17.32`
  )



  const rowHeight = pianoKey?.offsetHeight ?? 0

  const hitHeight = (whiteKey!.offsetHeight - blackKey!.offsetHeight) * 0.8

  const top = pianoKey!.offsetTop + (rowHeight - hitHeight) / 2

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