import { useState } from "react"
import { HitType } from "../shared.types"
import HitDetails from "../HitDetails/HitDetails"
import { useDraggable } from "@dnd-kit/core"

export default function Hit( { hit } : { hit: HitType } ) {

  const [showDetails, setShowDetails] = useState(false)

  const { voiceId, style, startTime, id } = hit

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })  

  const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => setShowDetails(!showDetails)

  const dragStyle = transform  
    ? { ...style, transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }  
    : style  

  return <>
    <div
      key={id}
      ref={setNodeRef}  
      {...attributes}  
      {...listeners}  
      className="hit"
      onClick={handleLeftClick}
      style={dragStyle}
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