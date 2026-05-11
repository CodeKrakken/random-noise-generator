import { allFrequencies } from "../../content/data"
import { setUpSample } from "../../functions"
import { voice } from "../../types/voice"
import snareFile  from '../../sounds/snare.wav';
import kickFile   from '../../sounds/kick.wav';
import { SlotProps } from "../../types/slot";

const isRest = (voice: voice) => {
  const restChance  = voice.restChance
  const diceRoll = Math.random()
  return diceRoll < restChance
}

const getRangeValue = (key: string, voice: voice) => {
  const minEl = voice[`min${key}` as keyof voice] ?? 0
  const maxEl = voice[`max${key}` as keyof voice] ?? 100

  return minEl as number + (Math.random() * (maxEl as number - (minEl as number)))
}

const detune = (frequency: number, voice: voice) => {
  const detune = getRangeValue('Detune', voice)
  const ratio = 105.94637142137626184333
  const semitoneUp = frequency / 100 * ratio
  const hzDiff = semitoneUp - frequency
  return frequency + hzDiff / 100 * detune
}

const getRandomFrequency = (voice: voice) => {

  let activeFrequencies = getActiveFrequencies(voice) 

  const randomIndex = Math.floor(Math.random() * activeFrequencies.length)
  const randomFrequency = activeFrequencies[randomIndex]

  return randomFrequency
}

const getActiveFrequencies = (voice: voice) => {
    
  const activeOctaves = voice.activeOctaves
  const activeNotes   = voice.activeNotes

  let activeFrequencies = allFrequencies.filter((octave, j) => activeOctaves.includes(j.toString()))
  
  let filteredFrequencies = activeFrequencies.map(octave =>
    octave.filter((note, j) => activeNotes.includes((j+1).toString()))
  )

  return filteredFrequencies.flat(Infinity)
}

console.log('New Slot')

export default function Slot(
  {
    voice,
    length,
    voices,
    context
  }: SlotProps
) {
  console.log('New Slot')
  const snareSample = setUpSample(snareFile, context)
  const kickSample  = setUpSample(kickFile, context)

  voice.thisSlot = voice.nextSlot
  voice.nextSlot += length
  
  const activeWaveforms = voice.activeWaveforms

  if (isRest(voice) || !activeWaveforms) {
    voice.gain?.gain.setValueAtTime(0,0)

  } else {          
    
    const minLevel  = voice.minLevel
    const maxLevel  = voice.maxLevel
    const minLength = voice.minLength
    const maxLength = voice.maxLength
    const offset = getRangeValue('Offset', voice)
    let noteLength = length
    setTimeout(() => {
      if (!activeWaveforms.length) return
      const randomWave = activeWaveforms[Math.floor(Math.random() * activeWaveforms.length)]
      const waveform = randomWave
      if (voice.oscillator) voice.oscillator.type = waveform as OscillatorType

      if (
        [
          'sine',
          'triangle',
          'sawtooth',
          'square',
        ]
        .includes(waveform)
      ) {
        try {
          const randomFrequency = getRandomFrequency(voice)
          const frequency   = detune(randomFrequency as number, voice)
          if (voice.oscillator) voice.oscillator.frequency.value = frequency

          const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
          noteLength = length / 100 * noteLengthPercentage
          const fadeInPercentage  = getRangeValue('FadeIn' , voice)
          const fadeOutPercentage = getRangeValue('FadeOut', voice)
          const peakPercentage    = (fadeInPercentage/(fadeInPercentage+fadeOutPercentage)) * 100 ||  0
          const level       = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/voices.filter(voice => voice.nextSlot).length
          if (noteLength < length) {
            setTimeout(() => {voice.gain?.gain.setValueAtTime(0, context.currentTime)}, noteLength*1000)
          }

            const fadeInDuration  = noteLength  / 100 * fadeInPercentage
            const fadeOutDuration = noteLength  / 100 * fadeOutPercentage
            const startOfFadeOut  = voice.nextSlot - fadeOutDuration
            const endOfFadeIn     = voice.thisSlot ? voice.thisSlot + fadeInDuration : fadeInDuration

            const peakPoint       = voice.thisSlot ? 
                                    voice.thisSlot + noteLength * peakPercentage / 100 : 
                                    noteLength * peakPercentage / 100

            if (endOfFadeIn <= startOfFadeOut) {

              voice.gain?.gain.setValueAtTime(voice.gain.gain.value, 0)
              voice.gain?.gain.linearRampToValueAtTime(level, endOfFadeIn)
              voice.gain?.gain.setValueAtTime(level, startOfFadeOut)
              voice.gain?.gain.linearRampToValueAtTime(0, voice.nextSlot)

            } else {

              voice.gain?.gain.setValueAtTime(voice.gain.gain.value, 0)
              voice.gain?.gain.linearRampToValueAtTime(level, peakPoint)
              voice.gain?.gain.setValueAtTime(level, peakPoint)
              voice.gain?.gain.linearRampToValueAtTime(0, voice.nextSlot)

            }
        } catch (error: unknown) {

          console.error(error instanceof Error ? error.message : "Unknown error", error)
          
        }
      } else {
        try {

          if (voice.oscillator) voice.oscillator.frequency.value = 0
          if (waveform === 'kick'  ) {kickSample.play()}
          if (waveform === 'snare' ) {snareSample.play()}

        } catch (error: unknown) {

          console.error(error instanceof Error ? error.message : "Unknown error", error)
        }
      }            
    }, offset * 10 * length)
  }

  return <></>
}