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

  <div
    className="timeline-container"
    style={{
      display: 'flex',
      height,
      overflowY: 'auto',
      overflowX: 'hidden'
    }}
  >

    {/* Piano */}

    <div
      className="piano-roll"
      style={{
        position: 'sticky',
        left: 0,
        width: 60,
        minWidth: 60,
        height,
        flexShrink: 0,
        zIndex: 20
      }}
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
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        flex: 1
      }}
    >
      <div
        className="timeline"
        style={{
          position: 'relative',
          width,
          minWidth: width,
          height
        }}
      >
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
                bottom: frequencyToPixels(hit.frequency) + 1,
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

  </div>
)
}

export default Timeline