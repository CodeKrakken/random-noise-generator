import { useEffect, useRef, useState } from 'react'
import { HitType, VoiceType } from '../../components/shared.types'
import { allFrequencies } from '../../content/data'
import Hit from '../Hit/Hit'
import Piano from '../Piano/Piano'

const Timeline = ({ 

  hits,
  voices 

} : {

  hits: HitType[]
  voices: VoiceType[]
  
}) => {

  const containerRef = useRef<HTMLDivElement>(null)  
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })

  const pixelsPerSecond = 100
  const pixelsPerNote = 12

  const frequencies = Array.from(new Set(allFrequencies.flat())).reverse()

  const updateVisibleRange = () => {  
    const el = containerRef.current  
    if (!el) return  
    
    const buffer = pixelsPerSecond * 2 // small buffer so hits don't pop in/out abruptly at the edge  
    
    const startPx = Math.max(el.scrollLeft - buffer, 0)  
    const endPx = el.scrollLeft + el.clientWidth + buffer  
    
    setVisibleRange({  
      start: startPx / pixelsPerSecond,  
      end: endPx / pixelsPerSecond  
    })  
  }  
  
  useEffect(() => {  
    updateVisibleRange()  
    
    const el = containerRef.current  
    if (!el) return  
    
    const resizeObserver = new ResizeObserver(updateVisibleRange)  
    resizeObserver.observe(el)  
    
    return () => resizeObserver.disconnect()  
  }, [])

  const visibleHits = hits.filter(hit =>  
    hit.startTime !== undefined &&  
    hit.endTime !== undefined &&  
    hit.frequency !== undefined &&  
    hit.endTime >= visibleRange.start &&  
    hit.startTime <= visibleRange.end  
  )

  const frequencyToPixels = (frequency: number) => {
    const key = document.getElementById(
      `timeline-grid-piano-${frequency}`
    )

    if (!key) return 0

    return key.offsetTop
  }

  return (

    <div id="timeline-container">

      {/* Piano */}

      <div 
        id="timeline-piano-container"
        className="component-border"
      >
        <Piano
          keys={frequencies}
          props={{
            id: 'timeline-piano'
          }}
        />
      </div>

      {/* Horizontally scrolling timeline */}
      <div 
        id="timeline-grid-piano-container"
        className="component-border"
        ref={containerRef}  
        onScroll={updateVisibleRange}  
      >
        <Piano
          keys={frequencies}
          props={{
            id: 'timeline-grid-piano'
          }}
        />

        {
          visibleHits.map((hit, i) => {
            
            return (
              <Hit 
                frequencies={frequencies}
                pixelsPerNote={pixelsPerNote}
                pixelsPerSecond={pixelsPerSecond}
                key={i}
                hit={hit}
                voices={voices}
                frequencyToPixels={frequencyToPixels}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default Timeline