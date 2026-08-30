import { useEffect, useRef, useState } from 'react'
import { HitType } from '../../components/shared.types'
import { allFrequencies, pixelsPerSecond } from '../../content/data'
import Hit from '../Hit/Hit'
import Piano from '../Piano/Piano'

const Timeline = ({ hits } : { hits: HitType[] }) => {

  const containerRef = useRef<HTMLDivElement>(null)  
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })

  const frequencies = Array.from(new Set(allFrequencies.flat())).reverse()

  const updateVisibleRange = () => {  
    const el = containerRef.current  
    if (!el) return  
    
    const buffer = pixelsPerSecond * 2
    
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
    hit.endTime   !== undefined &&  
    hit.frequency !== undefined &&  
    hit.endTime   >=  visibleRange.start &&  
    hit.startTime <=  visibleRange.end  
  )

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
          showKeyLabels={true}
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
            id: 'timeline-grid-piano',
            style: {
              width: Math.max(...hits.map(h => h.endTime)) * pixelsPerSecond
            }
          }}
          showKeyLabels={false}          
        />

        {
          visibleHits.map(hit => {
            
            return (
              <Hit hit={hit} />
            )
          })
        }
      </div>
    </div>
  )
}

export default Timeline