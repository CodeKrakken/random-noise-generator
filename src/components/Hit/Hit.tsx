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

  return <>
    <div
      key={key}
      className="hit"
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      style={hit.style}
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