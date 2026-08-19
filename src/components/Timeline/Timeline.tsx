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

      {/* <div 
        id="timeline-piano-container"
        className="component-border"
      >
        <Piano
          keys={frequencies}
          props={{
            id: 'timeline-piano'
          }}
        />
      </div> */}

      {/* Horizontally scrolling timeline */}

      <div 
        id="timeline-grid-container"
        className="component-border"
      >
        <div 
          id="timeline-grid"
          style={{
            width,
            minWidth: width,
            height
          }}
        >
          {
            frequencies.map((frequency, index) => {

              const noteIndex = index % 12


              return (
                <div
                  key={frequency}
                  className="timeline-grid-row"
                  id={`${frequency}`}
                  style={{
                    top: index * pixelsPerNote,
                    height: pixelsPerNote,
                    backgroundColor: blackNoteIndexes.includes(noteIndex) ? '#000000' : '#ffffff'
                  }}
                />
              )
            })
          }

          {/* Notes */}

          {
            hits.map((hit, i) => {

              if (
                hit.startTime === undefined ||
                hit.endTime === undefined ||
                hit.frequency === undefined
              ) {
                return null
              }


              return (
                <Hit 
                  frequencies={frequencies}
                  pixelsPerNote={pixelsPerNote}
                  pixelsPerSecond={pixelsPerSecond}
                  key={i}
                  hit={hit}
                  voices={voices}
                />
              )

            })
          }
        </div>
      </div>
    </div>
  )
}

export default Timeline