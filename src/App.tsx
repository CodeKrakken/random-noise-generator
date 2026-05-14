import { useEffect, useRef, useState } from 'react';
import './App.css';
import { allFrequencies, noteRatio, waveforms, oneMinute } from './content/data'
import snareFile  from './sounds/snare.wav';
import kickFile   from './sounds/kick.wav';
import Voice from './components/voice/Voice';
import Header from './components/header/Header';
import { voice } from './types/voice'
import { setUpVoice, setUpSample } from './functions';

function App() {

  const [context] = useState(() => new AudioContext())
  const [voices,  setVoices ] = useState<voice[]>([])
  const [running, setRunning] = useState<boolean>(false)

  const runningRef = useRef(false)
  const voicesRef = useRef(voices)

  useEffect(() => { runningRef.current = running }, [running])

  useEffect(() => { 
    voicesRef.current   = voices
    !voices.length && setRunning(false)
  }, [voices])

  const addVoice = () => {
    setVoices(voices => [voices, setUpVoice(voices[voices.length - 1])].flat())
  }

  const samples = {
    snare: setUpSample(snareFile, context),
    kick: setUpSample(kickFile, context)
  }

  const handleStartStop = () => {
    runningRef.current ? stopAll(voices) : start()
  }

  const setUpOscillator = (voice: voice) => {
    const oscillator  = context.createOscillator()
    const gain        = context.createGain()

    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0, 0)
    oscillator.start(0);

    voice.oscillator = oscillator
    voice.gain       = gain
    voice.nextInterval = context.currentTime
  }

  const start = async () => {
    await setRunning(true)
    voices.forEach((voice) => {

      runInterval(voice)
    })
  }

  const stopAll = (voices: voice[]) => {
    setRunning(false)
    
    voices.forEach(voice => {
      stopOne(voice)
    })
  }

  const stopOne = (voice: voice) => {
    voice.gain?.gain.setValueAtTime(0, context.currentTime)
    voice.oscillator?.stop()
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
            playNote(voice, intervalLength)
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

  const playNote = (voice: voice, length: number) => {

    const offsetTime = getOffsetTime(voice, length)
    setTimeout(() => {
 
      try {
        const activeSounds = voice.activeSounds
        const randomSound = randomOneFrom(activeSounds)

        if (waveforms.includes(randomSound)) {
          setUpOscillator(voice)
          voice.oscillator!.type = randomSound
          oscillate(voice, length, offsetTime)
          
        } else {
          playSample(voice, randomSound)
        }

      } catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error", error)
      }            
    }, offsetTime*1000)
  }

  const oscillate = (voice: voice, length: number, offsetTime: number) => {

    voice.oscillator!.frequency.value = generateFrequency(voice)

    const noteLength = generateNoteLength(voice, length)
    
    if (noteLength < length) {
      scheduleNoteEnd(voice, noteLength, offsetTime)
    }

    shapeNote(voice, noteLength, offsetTime)
  }

  const playSample = (voice: voice, sound: string) => {
    voice.oscillator!.frequency.value = 0

    samples[sound as keyof typeof samples].play()
  }

  const getFadeLength = (percentage: number, noteLength: number) => noteLength * percentage / 100

  const shapeNote = (voice: voice, noteLength: number, offsetTime: number) => {

    const gain = voice.gain!.gain

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
    const level = generateLevel(voice, voicesRef.current)

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

  const scheduleNoteEnd = (voice: voice, noteLength: number, offsetTime: number) => {
    setTimeout(() => {
      voice.gain?.gain.setValueAtTime(0, context.currentTime)
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
    setTimeout(
      () => {runInterval(voice)}, 
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
    
    voice.gain?.gain.setValueAtTime(0, 0)
    voice.oscillator?.stop()

    setVoices([voices.slice(0,i), voices.slice(i+1)].flat())
  }

  return <>
    <br />
    <Header 
      handleStartStop   = {handleStartStop}
      cycleButtonLabel  = {running}
      addVoice          = {addVoice}
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
