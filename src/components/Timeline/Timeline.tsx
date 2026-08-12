import { Hit } from '../../Synth/Synth.types'
import { allFrequencies, noteNameToIndex } from '../../content/data'
import Piano from '../Piano/Piano'

type TimelineProps = {
  hits: Hit[]
}

const Timeline = ({ hits }: TimelineProps) => {

  const pixelsPerSecond = 100
  const pixelsPerNote = 12
  const timelineSeconds = 60

  const frequencies = Array.from(new Set(allFrequencies.flat()))

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

    return String((frequencies.length - 1 - closestIndex) * pixelsPerNote)
  }

  const getNoteName = (index: number) => {

    const noteNames = Object.keys(noteNameToIndex)

    return noteNames[index % 12]
  }

  return (
    <div
      className="timeline-container"
      style={{
        display: 'flex',
        height,
        overflow: 'auto'
      }}
    >
      <Piano
        keys={frequencies}
        props={{id: 'timeline-piano'}}
      />

      {/* Timeline */}

      <div
        className="timeline"
        style={{
          position: 'relative',
          width,
          minWidth: width,
          height
        }}
      >

        {/* Grid */}

        {frequencies.map((frequency, index) => (
          <div
            key={frequency}
            style={{
              position: 'absolute',
              left: 0,
              top: index * pixelsPerNote,
              width: '100%',
              height: pixelsPerNote,
              borderBottom: '1px dotted #363636',
              boxSizing: 'border-box'
            }}
          />
        ))}

        {/* Notes */}

        {hits.map((hit, index) => {

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
              style={{
                position: 'absolute',
                left: hit.startTime * pixelsPerSecond,
                top: frequencyToPixels(hit.frequency) + 1,
                width: Math.max(
                  (hit.endTime - hit.startTime) *
                  pixelsPerSecond,
                  3
                ),
                height: pixelsPerNote - 2,
                background: 'red',
                borderRadius: 2,
                zIndex: 10
              }}
            />
          )

        })}

      </div>

    </div>
  )
}

export default Timeline