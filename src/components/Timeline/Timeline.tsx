import { HitType, VoiceType } from '../../components/shared.types'
import { allFrequencies } from '../../content/data'
import Hit from '../Hit/Hit'
import Piano from '../Piano/Piano'
import TimelineGrid from '../TimelineGrid'

const Timeline = ({ 

  hits,
  voices 

} : {

  hits: HitType[]
  voices: VoiceType[]
  
}) => {

  const pixelsPerSecond = 100
  const pixelsPerNote = 12
  const timelineSeconds = 60

  const frequencies = Array.from(new Set(allFrequencies.flat())).reverse()

  const width = timelineSeconds * pixelsPerSecond
  const height = frequencies.length * pixelsPerNote

  const blackNoteIndexes = [2, 4, 6, 9, 11];

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

      <TimelineGrid 
        frequencies = {frequencies}
        hits        = {hits}
        voices      = {voices}
      />
    </div>
  )
}

export default Timeline