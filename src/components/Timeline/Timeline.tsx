import { Hit } from '../../Synth/Synth.types'
import { allFrequencies } from '../../content/data'
import Piano from '../Piano/Piano'

type TimelineProps = {
  hits: Hit[]
}

const Timeline = ({ hits }: TimelineProps) => {

  const pixelsPerSecond = 100
  const pixelsPerNote = 12
  const timelineSeconds = 60

  const frequencies = Array.from(new Set(allFrequencies.flat())).reverse()

  const width = timelineSeconds * pixelsPerSecond
  const height = frequencies.length * pixelsPerNote

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

  return (

    <div id="timeline-container">

      {/* Piano */}

      <div id="timeline-piano-container">
        <Piano
          keys={frequencies}
          props={{
            id: 'timeline-piano'
          }}
        />
      </div>

      {/* Horizontally scrolling timeline */}

      <div id="timeline-grid-container">
        <div 
          id="timeline-grid"
          style={{
            width,
            minWidth: width,
            height
          }}
        >
          {
            frequencies.map((frequency, index) => (
              <div
                key={frequency}
                className="timeline-grid-row"
                style={{
                  top: index * pixelsPerNote,
                  height: pixelsPerNote,
                }}
              />
            ))
          }

          {/* Notes */}

          {
            hits.map((hit, index) => {

              if (
                hit.startTime === undefined ||
                hit.endTime === undefined ||
                hit.frequency === undefined
              ) {
                return null
              }


              return (
                <div
                  key={index}
                  className="hit"
                  style={{
                    left: hit.startTime * pixelsPerSecond,
                    bottom: frequencyToPixels(hit.frequency) + 1,
                    width: Math.max(
                      (hit.endTime - hit.startTime) *
                      pixelsPerSecond,
                      3
                    ),
                    height: pixelsPerNote - 2,
                  }}
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