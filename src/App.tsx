import { useEffect, useRef, useState } from 'react';
import './App.css';
import { allFrequencies, noteRatio, waveforms, oneMinute } from './content/data'
import Voice from './components/voice/Voice';
import Header from './components/header/Header';
import { voice } from './types/voice'
import { setUpVoice, setUpSample } from './functions';
import { OscGain } from './types';
import { samples } from './content/data';


function App() {

  // state

  const [context] = useState(() => new AudioContext())
  const [voices,  setVoices] = useState<voice[]>([])
  const [running, setRunning] = useState<boolean>(false)

  // refs

  const runningRef = useRef(false)
  const voicesRef = useRef(voices)

  // useEffect

  useEffect(() => { 

    voicesRef.current = voices
    if (!voices.length) toggleRunning(false)   

  }, [voices])

  // functions

  const handleAddVoice = () => {
    const newVoice = setUpVoice(voices[voices.length - 1])
    const nextInterval = voices[voices.length -1]?.nextInterval
    if (running) firstInterval(newVoice, nextInterval)
    setVoices(voices => [voices, newVoice].flat())
  }

  const firstInterval = (voice: voice, nextInterval: number) => {
    voice.nextInterval = nextInterval
    voice.isActive = true
    runInterval(voice)
  }

  const handleStartStop = () => {
    runningRef.current ? stopAll(voices) : start()
  }

  const setUpOscillator = () => {
    const oscillator  = context.createOscillator()
    const gain        = context.createGain()

    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0, 0)
    oscillator.start(0);
    return {oscillator, gain}
  }

  const start = async () => {
    toggleRunning(true)
    voices.forEach(voice => firstInterval(voice, context.currentTime))
  }

  const stopAll = (voices: voice[]) => {

    toggleRunning(false)
    
    voices.forEach(voice => {
      stopOne(voice)
    })
  }

  const toggleRunning = (state: boolean) => {
    runningRef.current = state
    setRunning(state)
  }

  const stopOne = (voice: voice) => {
    voice.gain?.gain.setValueAtTime(0, context.currentTime)
    voice.oscillator?.stop()
    voice.isActive = false
  }


  const runInterval = (voice: voice) => {
    try {    
      if (isRunning()) {
        const thisInterval = voice.nextInterval
        voice.thisInterval = voice.nextInterval
    
        if (isTimeFor(thisInterval)) {
          const intervalLength = getIntervalLength(voice)

          voice.nextInterval += intervalLength
                    
          if (isRest(voice)) {
            voice.gain?.gain.setValueAtTime(0,0)
          } else {
            makeSound(voice, intervalLength)
          }
        } 

        nextInterval(voice)
      }
    } catch (error) {}
  }

  const isRunning = () => {
    return runningRef.current
  }

  const isTimeFor = (timeCode: number) => {
    return context.currentTime >= timeCode
  }

  const makeSound = (voice: voice, length: number) => {

    const offsetTime = getOffsetTime(voice, length)

    setTimeout(() => {
 
      try {
        const activeSounds = voice.activeSounds
        const randomSound = randomOneFrom(activeSounds)
        const level = generateLevel(voice, voicesRef.current)

        if (waveforms.includes(randomSound)) {
          const oscGain = setUpOscillator()
          oscGain.oscillator.type = randomSound
          oscillate(voice, length, offsetTime, level, oscGain)
          setTimeout(() => {removeOscillator(oscGain)}, length*1000)
        } else {
          playSample(voice, randomSound, level)
        }

      } catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error", error)
      }            
    }, offsetTime*1000)
  }

  const oscillate = (voice: voice, length: number, offsetTime: number, level: number, oscGain: OscGain) => {

    oscGain.oscillator!.frequency.value = generateFrequency(voice)

    const noteLength = generateNoteLength(voice, length)
    
    if (noteLength < length) {
      scheduleNoteEnd(oscGain, noteLength, offsetTime)
    }

    shapeNote(voice, oscGain, noteLength, offsetTime, level)
  }

  const removeOscillator = (oscGain: OscGain) => {
    const { oscillator, gain } = oscGain
    oscillator!.stop()
    oscillator!.disconnect()
    gain!.disconnect()
  }

  const playSample = (voice: voice, name: string, level: number) => {

    const sample = setUpSample(voice, samples[name as keyof typeof samples], context, level)
    sample.play()
  }

  const getFadeLength = (percentage: number, noteLength: number) => noteLength * percentage / 100

  const shapeNote = (voice: voice, oscGain: OscGain, noteLength: number, offsetTime: number, level: number) => {

    const gain = oscGain.gain!.gain

    const thisInterval = voice.thisInterval! + offsetTime
    const fadeInPercentage  = getRangeValue('FadeIn', voice)
    const fadeOutPercentage = getRangeValue('FadeOut', voice)

    const fadeInLength  = getFadeLength(fadeInPercentage , noteLength)
    const fadeOutLength = getFadeLength(fadeOutPercentage, noteLength)

    const endOfFadeIn    = thisInterval + fadeInLength
    const startOfFadeOut = thisInterval + noteLength - fadeOutLength
    const peakPoint = thisInterval + noteLength * fadeInPercentage / (fadeInPercentage + fadeOutPercentage)
    const overlap = endOfFadeIn >= startOfFadeOut
    const startOfPeak = overlap ? peakPoint : endOfFadeIn
    const endOfPeak   = overlap ? peakPoint : startOfFadeOut

    gain.setValueAtTime(0, thisInterval)
    gain.linearRampToValueAtTime(level, startOfPeak)
    gain.setValueAtTime(level, endOfPeak)
    gain.linearRampToValueAtTime(0, thisInterval + noteLength)
    gain.setValueAtTime(gain.value, 0)
  }

  const generateLevel = (voice: voice, voices: voice[]) => {
    const { minLevel, maxLevel } = voice

    const balancedLevel = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/voices.length

    return balancedLevel
  }

  const generateNoteLength = (voice: voice, intervalLength: number) => {

    const { minLength, maxLength } = voice
    const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
    const noteLength = intervalLength / 100 * noteLengthPercentage

    return noteLength
  }

  const scheduleNoteEnd = (oscGain: OscGain, noteLength: number, offsetTime: number) => {
    setTimeout(() => {
      oscGain.gain?.gain.setValueAtTime(0, context.currentTime)
    }, (offsetTime + noteLength)*1000)
  }


  const generateFrequency = (voice: voice) => {
    const randomFrequency = getRandomFrequency(voice)
    const frequency   = detune(randomFrequency as number, voice)
    return frequency
  }

  const randomOneFrom = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const getOffsetTime = (voice: voice, intervalLength: number) => {
    return getRangeValue('Offset', voice) / 100 * intervalLength
  }

  const nextInterval = (voice: voice) => {

    if (!voice.isActive) return

    setTimeout(
      () => {
        if (!voice.isActive) return
        runInterval(voice)
      }, 
      (voice.nextInterval - context.currentTime)*1000
    )    
  }

  const getIntervalLength = (voice: voice) => {
    const {activeIntervals, bpm} = voice
    const interval = randomOneFrom(activeIntervals) || '0'
    const intervalLength  = oneMinute / bpm * parseFloat(interval)
    return intervalLength
  }
       
  const isRest = (voice: voice) => {
    const restChance  = voice.restChance/100
    const diceRoll = Math.random()
    const result = diceRoll < restChance
    return result
  }

  const getRangeValue = (key: string, voice: voice) => {

    const minEl = voice[`min${key}` as keyof voice]
    const maxEl = voice[`max${key}` as keyof voice]

    const rangeValue = (
      minEl as number + (Math.random() * (
      maxEl as number - (minEl as number)))
    )

    return rangeValue
  }

  const detune = (frequency: number, voice: voice) => {

    // Refactor to use real values, not computed ones

    const cents = getRangeValue('Detune', voice)
    const semitoneUp = frequency * noteRatio
    const hzDiff = semitoneUp - frequency

    return frequency + hzDiff / 100 * cents
  }

  const getRandomFrequency = (voice: voice) => {
    
    const activeFrequencies = getActiveFrequencies(voice) 
    const randomIndex = Math.floor(Math.random()*activeFrequencies.length)
    const randomFrequency = activeFrequencies[randomIndex]
    
    return randomFrequency
  }

  const getActiveFrequencies = (voice: voice) => {
    
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

  const handleDelete = (i: number) => {

    const voice = voices[i]

    voice.isActive = false

    setVoices(voices =>
      voices.filter((_, j) => j !== i)
    )
  }

  return <>
    <br />
    <Header 
      handleStartStop   = {handleStartStop}
      cycleButtonLabel  = {running}
      handleAddVoice    = {handleAddVoice}
      showStart         = {Boolean(voices.length)}
    />

    <br />
    <br />
    {
      voices.map((voice, i) => 
        <div key={i}>
          <Voice 
            i             = {i} 
            setVoices     = {setVoices} 
            voices        = {voices}
            handleDelete  = {handleDelete}
            dataAttribute = "Voices"
          />
        </div>
      )
    }
  </>
}

export default App;
