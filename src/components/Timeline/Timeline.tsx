import { Hit } from '../../Synth/Synth.types'
import { allFrequencies } from '../../content/data'

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

    return closestIndex * pixelsPerNote
  }

  return (
    <div
      id="timeline"
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >

      {/* 132-note grid */}

      {frequencies.map((frequency, index) => (

        <div
          key={frequency}
          style={{
            position: 'absolute',
            left: 0,
            top: index * pixelsPerNote,
            width: '100%',
            height: pixelsPerNote,
            borderBottom: '1px dotted #383838',
            boxSizing: 'border-box',
          }}
        />

      ))}

      {/* Recorded notes */}

      {hits.map((hit, index) => {

        if (
          hit.startTime === undefined ||
          hit.endTime === undefined ||
          hit.frequency === undefined
        ) {
          return null
        }

        const left =
          hit.startTime * pixelsPerSecond

        const width =
          Math.max(
            (hit.endTime - hit.startTime) *
            pixelsPerSecond,
            3
          )

        const top =
          frequencyToPixels(hit.frequency)

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left,
              top: top + 1,
              width,
              height: pixelsPerNote - 2,
              background: 'red',
              borderRadius: 2,
              zIndex: 1
            }}
          />
        )

      })}

    </div>
  )
}

export default Timeline