import { useState } from "react"
import { HitType } from "../shared.types"
import HitDetails from "../HitDetails/HitDetails"

export default function Hit( { hit } : { hit:HitType } ) {

  const [showDetails, setShowDetails] = useState(false)

  const { voiceId, style } = hit

  const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => setShowDetails(!showDetails)

  return <>
    <div
      key={voiceId}
      className="hit"
      onClick={handleLeftClick}
      style={style}
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