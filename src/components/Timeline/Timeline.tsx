import { Hit } from '../../Synth/Synth.types'

type TimelineProps = {
  hits: Hit[]
}

const Timeline = ({ hits }: TimelineProps) => {

  const pixelsPerSecond = 100
  const pixelsPerSemitone = 12

  const validHits = hits.filter(
    hit =>
      hit.startTime !== undefined &&
      hit.endTime !== undefined &&
      hit.frequency !== undefined
  )

  if (!validHits.length) {
    return <div className="timeline" />
  }

  const maxTime = Math.max(
    ...validHits.map(hit => hit.endTime!)
  )

  const pitches = validHits.map(
    hit => 69 + 12 * Math.log2(hit.frequency! / 440)
  )

  const highestPitch = Math.ceil(Math.max(...pitches))
  const lowestPitch = Math.floor(Math.min(...pitches))

  const width = maxTime * pixelsPerSecond
  const height =
    (highestPitch - lowestPitch + 1) * pixelsPerSemitone

  const timeToPixels = (time: number) =>
    time * pixelsPerSecond

  const frequencyToPixels = (frequency: number) => {

    const midi = 69 + 12 * Math.log2(frequency / 440)

    return (highestPitch - midi) * pixelsPerSemitone
  }

  return (
    <div
      className="timeline"
      style={{
        position: 'relative',
        width,
        height
      }}
    >

      {Array.from(
        { length: highestPitch - lowestPitch + 1 },
        (_, i) => {

          const midi = highestPitch - i

          return (
            <div
              key={midi}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: i * pixelsPerSemitone,
                height: pixelsPerSemitone,
                borderBottom: '1px solid #ddd'
              }}
            />
          )
        }
      )}

      {validHits.map((hit, i) => {

        const left = timeToPixels(hit.startTime!)
        const width = timeToPixels(
          hit.endTime! - hit.startTime!
        )
        const top = frequencyToPixels(hit.frequency!)

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left,
              top,
              width: Math.max(width, 3),
              height: pixelsPerSemitone - 2,
              background: '#333',
              borderRadius: 2
            }}
          />
        )
      })}

    </div>
  )
}

export default Timeline