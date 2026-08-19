import { HitType } from "../shared.types"

export default function Hit({
  frequencies,
  pixelsPerNote,
  pixelsPerSecond,
  key,
  hit
} : {
  frequencies: number[]
  pixelsPerNote: number
  pixelsPerSecond: number
  key: number
  hit: HitType
}) {

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
      key={key}
      className="hit"
      style={{
        left: hit.startTime! * pixelsPerSecond,
        bottom: frequencyToPixels(hit.frequency!) + 1,
        width: Math.max(
          (hit.endTime! - hit.startTime!) *
          pixelsPerSecond,
          3
        ),
        height: pixelsPerNote - 2,
        backgroundColor: hit.colour
      }}
    />
  )
}