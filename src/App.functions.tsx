import { OscGain, RunningRef, VoicesRef, Waveform }     from "./App.types"
import { VoiceType }                                    from "./components/Voice/Voice.types"
import { allFrequencies, extrema, oneMinute, samples }  from './content/data';

const setUpVoice = (template: VoiceType | null = null) => {
  return {
    isActive        : false,
    label           : template?.label!+1        ||  1,
    nextInterval    : template?.nextInterval    ||  0,
    bpm             : template?.bpm             ??  60,
    minLevel        : template?.minLevel        ??  100,
    maxLevel        : template?.maxLevel        ??  100,
    activeNotes     : template?.activeNotes     ??  ['1','3','5','6','8','10','12','13'],
    activeOctaves   : template?.activeOctaves   ??  ['4'],
    activeIntervals : template?.activeIntervals ??  ['1'],
    activeSounds    : template?.activeSounds    ??  ['sine'],
    restChance      : template?.restChance      ??  0,
    minLength       : template?.minLength       ??  100,
    maxLength       : template?.maxLength       ??  100,
    minOffset       : template?.minOffset       ??  0,  
    maxOffset       : template?.maxOffset       ??  0,
    minDetune       : template?.minDetune       ??  0,
    maxDetune       : template?.maxDetune       ??  0,
    minFadeIn       : template?.minFadeIn       ??  100,
    maxFadeIn       : template?.maxFadeIn       ??  100,
    minFadeOut      : template?.minFadeOut      ??  100,
    maxFadeOut      : template?.maxFadeOut      ??  100,
  }
}

const setUpSample = (
  file: string, 
  context: AudioContext, 
  level: number
) => {

  const sample = new Audio(file)
  const sound = context.createMediaElementSource(sample);
  const gain  = context.createGain()
  
  sound.connect(gain)
  gain.gain.setValueAtTime(level, 0)
  gain.connect(context.destination)

  return sample
}

const setUpOscillator = (context: AudioContext) => {
  const oscillator  = context.createOscillator()
  const gain        = context.createGain()

  oscillator.connect(gain);
  gain.gain.setValueAtTime(0, 0)
  gain.connect(context.destination);
  oscillator.start(0);

  return {oscillator, gain}
}

const removeOscillator = (oscGain: OscGain) => {
  const { oscillator, gain } = oscGain
  oscillator.stop()
  oscillator.disconnect()
  gain.disconnect()
}

const playSample = (
  name: string, 
  level: number,
  context: AudioContext
) => {
  const sample = setUpSample(samples[name as keyof typeof samples], context, level)
  sample.play()
}

const scheduleNoteEnd = (
  oscGain: OscGain, 
  noteLength: number, 
  offsetTime: number,
  context: AudioContext
) => {
  setTimeout(() => {
    oscGain.gain?.gain.setValueAtTime(0, context.currentTime)
  }, (offsetTime + noteLength)*1000)
}

const oscillate = (
  voice: VoiceType, 
  length: number, 
  offsetTime: number, 
  level: number, 
  oscGain: OscGain,
  sound: OscillatorType,
  context: AudioContext
) => {

  oscGain.oscillator.frequency.value = generateFrequency(voice)
  oscGain.oscillator.type = sound

  const noteLength = generateNoteLength(voice, length)
  
  if (noteLength < length) scheduleNoteEnd(oscGain, noteLength, offsetTime, context)

  const gain         = oscGain.gain!.gain
  const thisInterval = voice.thisInterval! + offsetTime

  const fadeInPercentage  = getRangeValue('FadeIn', voice)
  const fadeOutPercentage = getRangeValue('FadeOut', voice)

  const fadeInLength  = getFadeLength(fadeInPercentage , noteLength)
  const fadeOutLength = getFadeLength(fadeOutPercentage, noteLength)

  const endOfFadeIn    = thisInterval + fadeInLength
  const startOfFadeOut = thisInterval + noteLength - fadeOutLength
  const peakPoint      = thisInterval + noteLength * fadeInPercentage / (fadeInPercentage + fadeOutPercentage)
  const overlap        = endOfFadeIn >= startOfFadeOut
  const startOfPeak    = overlap ? peakPoint : endOfFadeIn
  const endOfPeak      = overlap ? peakPoint : startOfFadeOut

  gain.setValueAtTime(0, thisInterval)
  gain.linearRampToValueAtTime(level, startOfPeak)
  gain.setValueAtTime(level, endOfPeak)
  gain.linearRampToValueAtTime(0, thisInterval + noteLength)
  gain.setValueAtTime(gain.value, 0)  
}

const makeSound = (
  voice: VoiceType, 
  length: number, 
  voicesRef: VoicesRef, 
  waveforms: string[], 
  context: AudioContext
) => {

  const offsetTime = getOffsetTime(voice, length)

  setTimeout(() => {

    try {
      const activeSounds = voice.activeSounds
      const randomSound = randomOneFrom(activeSounds) as OscillatorType
      const level = generateLevel(voice, voicesRef.current)

      if (waveforms.includes(randomSound)) {
        const oscGain = setUpOscillator(context)
        oscillate(voice, length, offsetTime, level, oscGain, randomSound, context)
        setTimeout(() => removeOscillator(oscGain), length*1000)
      } else {
        playSample(randomSound, level, context)
      }

    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error", error)
    }            
  }, offsetTime*1000)
}

const randomOneFrom = (array: (OscillatorType | String)[]) => {
  return array[Math.floor(Math.random() * array.length)]
}

const isRest = (voice: VoiceType) => {
  const restChance  = voice.restChance/100
  const diceRoll = Math.random()
  const result = diceRoll < restChance
  return result
}

const generateLevel = (voice: VoiceType, voices: VoiceType[]) => {
  const { minLevel, maxLevel } = voice
  const balancedLevel = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/voices.length
  return balancedLevel
}

const generateNoteLength = (voice: VoiceType, intervalLength: number) => {

  const { minLength, maxLength } = voice
  const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
  const noteLength = intervalLength / 100 * noteLengthPercentage

  return noteLength
}

const getFadeLength = (percentage: number, noteLength: number) => noteLength * percentage / 100

const generateFrequency = (voice: VoiceType) => {
  const randomFrequency = getRandomFrequency(voice)
  const frequency   = detune(randomFrequency as number, voice)
  return frequency
}

const detune = (frequency: number, voice: VoiceType) => {

  const cents = getRangeValue('Detune', voice)
  if (!cents) return frequency
  
  const freqArray = [...new Set(allFrequencies.flat())]
  
  const modifier = cents < 0 ? -1 : 1
  const nextFreq = freqArray[freqArray.indexOf(frequency) + modifier]
  const hzDiff = Math.max(nextFreq, frequency) - Math.min(nextFreq, frequency)
  const detunedFrequency = frequency + hzDiff / 100 * cents
  
  return detunedFrequency
}

const getRandomFrequency = (voice: VoiceType) => {
    
  const activeFrequencies = getActiveFrequencies(voice) 
  const randomIndex = Math.floor(Math.random()*activeFrequencies.length)
  const randomFrequency = activeFrequencies[randomIndex]
  
  return randomFrequency
}


const getActiveFrequencies = (voice: VoiceType) => {
    
  const activeOctaves = voice.activeOctaves
  const activeNotes   = voice.activeNotes

  let allFrequenciesInOctaves = allFrequencies.filter(
    (octave, j) => activeOctaves.includes(j.toString())
  )
  
  let activeFrequencies = allFrequenciesInOctaves.map(octave =>
    octave.filter((note, j) => activeNotes.includes((j+1).toString()))
  )

  return activeFrequencies.flat(Infinity)
}

const getIntervalLength = (voice: VoiceType) => {
  const {activeIntervals, bpm} = voice
  const interval = (randomOneFrom(activeIntervals) || '0') as string
  const intervalLength  = oneMinute / bpm * parseFloat(interval)
  return intervalLength
}

const getOffsetTime = (
  voice: VoiceType, 
  intervalLength: number
) => getRangeValue('Offset', voice) / 100 * intervalLength

const getRangeValue = (key: string, voice: VoiceType) => {
    
  const [min, max] = extrema.map(prefix => voice[prefix + key as keyof VoiceType])

  const rangeValue = (
    min as number + (Math.random() * (
    max as number - (min as number)))
  )

  return rangeValue
}

const runInterval = (
  voice: VoiceType, 
  runningRef: RunningRef, 
  voicesRef: VoicesRef, 
  waveforms: Waveform[], 
  context: AudioContext
) => {
  try {    
    if (isRunning(runningRef.current)) {
      const thisInterval = voice.nextInterval
      voice.thisInterval = voice.nextInterval
  
      if (isTimeFor(thisInterval, context)) {
        const intervalLength = getIntervalLength(voice)
        voice.nextInterval += intervalLength
      
        if (!isRest(voice)) makeSound(voice, intervalLength, voicesRef, waveforms, context)
      } 

      nextInterval(voice, context, runningRef, voicesRef, waveforms)
    }
  } catch (error) {}
}

const nextInterval = (
  voice: VoiceType, 
  context: AudioContext, 
  runningRef: RunningRef, 
  voicesRef: VoicesRef, 
  waveforms: Waveform[]
) => {

  if (!voice.isActive) return

  setTimeout(() => {
    if (!voice.isActive) return
    runInterval(voice, runningRef, voicesRef, waveforms, context)
  }, (voice.nextInterval - context.currentTime)*1000)    
}

const firstInterval = (
  voice: VoiceType, 
  nextInterval: number, 
  runningRef: RunningRef, 
  voicesRef: VoicesRef, 
  waveforms: Waveform[], 
  context: AudioContext
) => {
  voice.nextInterval = nextInterval
  voice.isActive = true
  runInterval(voice, runningRef, voicesRef, waveforms, context)
}

const stopOne = (voice: VoiceType) => voice.isActive = false

const isRunning = (running: boolean) => running

const isTimeFor = (timeCode: number, context: AudioContext) => context.currentTime >= timeCode

export { 
  setUpVoice,
  firstInterval,
  stopOne
}