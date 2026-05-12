import { useEffect, useRef, useState } from 'react';
import './App.css';
import { allFrequencies, waveforms } from './content/data'
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

  useEffect(() => {
    runningRef.current = running
  }, [running])

  const addVoice = () => {
    setVoices(voices => [voices, setUpVoice(voices[voices.length - 1])].flat())
  }
 
  const snareSample = setUpSample(snareFile, context)
  const kickSample  = setUpSample(kickFile, context)

  const handleStartStop = () => {
    runningRef.current ? stop() : start()
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
    voices.forEach((voice, i) => {

      setUpOscillator(voice)
      newInterval(i)
    })
  }

  const stop = () => {
    setRunning(false)
    voices.forEach(voice => {
      stopVoice(voice)
    })
  }

  const stopVoice = (voice: voice) => {
    voice.gain?.gain.setValueAtTime(0, context.currentTime)
    voice.oscillator?.stop()
  }

  const isRunning = () => {
    return runningRef.current
  }

  const isTimeForScheduled = (timeCode: number) => {
    return context.currentTime >= timeCode
  }

  const playNote = (voice: voice, intervalLength: number) => {

    const minLevel  = voice.minLevel
    const maxLevel  = voice.maxLevel
    const minLength = voice.minLength
    const maxLength = voice.maxLength
    const offset    = getRangeValue('Offset', voice)

    let noteLength = intervalLength

    setTimeout(() => {

      const activeWaveforms = voice.activeWaveforms
      // if (!activeWaveforms.length) return
      
      const randomWaveform = activeWaveforms[Math.floor(Math.random() * activeWaveforms.length)]

      if (voice.oscillator) voice.oscillator.type = randomWaveform as OscillatorType

      if (waveforms.includes(randomWaveform)) {
        try {
          const randomFrequency = getRandomFrequency(voice)
          const frequency   = detune(randomFrequency as number, voice)
          if (voice.oscillator) voice.oscillator.frequency.value = frequency

          const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
          noteLength = intervalLength / 100 * noteLengthPercentage
          const fadeInPercentage  = getRangeValue('FadeIn' , voice)
          const fadeOutPercentage = getRangeValue('FadeOut', voice)
          const peakPercentage    = (fadeInPercentage/(fadeInPercentage+fadeOutPercentage)) * 100 ||  0
          const level       = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/voices.filter(voice => voice.nextInterval).length
          if (noteLength < intervalLength) {
            setTimeout(() => {voice.gain?.gain.setValueAtTime(0, context.currentTime)}, noteLength*1000)
          }

            const fadeInDuration  = noteLength  / 100 * fadeInPercentage
            const fadeOutDuration = noteLength  / 100 * fadeOutPercentage
            const startOfFadeOut  = voice.nextInterval - fadeOutDuration
            const endOfFadeIn     = voice.thisInterval ? voice.thisInterval + fadeInDuration : fadeInDuration

            const peakPoint       = voice.thisInterval ? 
                                    voice.thisInterval + noteLength * peakPercentage / 100 : 
                                    noteLength * peakPercentage / 100

            if (endOfFadeIn <= startOfFadeOut) {

              voice.gain?.gain.setValueAtTime(voice.gain.gain.value, 0)
              voice.gain?.gain.linearRampToValueAtTime(level, endOfFadeIn)
              voice.gain?.gain.setValueAtTime(level, startOfFadeOut)
              voice.gain?.gain.linearRampToValueAtTime(0, voice.nextInterval)

            } else {

              voice.gain?.gain.setValueAtTime(voice.gain.gain.value, 0)
              voice.gain?.gain.linearRampToValueAtTime(level, peakPoint)
              voice.gain?.gain.setValueAtTime(level, peakPoint)
              voice.gain?.gain.linearRampToValueAtTime(0, voice.nextInterval)

            }
        } catch (error: unknown) {

          console.error(error instanceof Error ? error.message : "Unknown error", error)
          
        }
      } else {
        try {

          if (voice.oscillator) voice.oscillator.frequency.value = 0
          if (randomWaveform === 'kick'  ) {kickSample.play()}
          if (randomWaveform === 'snare' ) {snareSample.play()}

        } catch (error: unknown) {

          console.error(error instanceof Error ? error.message : "Unknown error", error)
        }
      }            
    }, offset * 10 * intervalLength)
  }

  const newInterval = (i: number) => {

    try {   
        
      if (isRunning()) {

        const voice = voices[i]
        const interval = voice.nextInterval
    
        if (isTimeForScheduled(interval)) {

          const intervalLength = getIntervalLength(i)

          voice.thisInterval = voice.nextInterval
          voice.nextInterval += intervalLength
          
          const activeWaveforms = voice.activeWaveforms
          
          if (isRest(i) || !activeWaveforms) {
            voice.gain?.gain.setValueAtTime(0,0)

          } else {          

            playNote(voice, intervalLength)
          }

          if (voices.length) {
            setTimeout(() => {newInterval(i)}, (voice.nextInterval - context.currentTime)*1000)
          }          

        } else {

          setTimeout(() => {newInterval(i)}, (voice.nextInterval - context.currentTime)*1000)
        }
      }
    } catch (error) {}
  }

  const getIntervalLength = (i: number) => {
    const liveIntervals = voices[i].activeIntervals
    const interval = liveIntervals[Math.floor(Math.random() * liveIntervals.length)] || '0'
    const bpm = voices[i].bpm
    const intervalLength  = 60000/bpm * parseFloat(interval)
    return intervalLength/1000
  }
       
  const isRest = (i: number) => {
    const restChance  = voices[i].restChance/100
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
    
    const activeFrequencies = getActiveFrequencies(voice) 
    const randomIndex = Math.floor(Math.random()*activeFrequencies.length)
    const randomFrequency = activeFrequencies[randomIndex]
    
    return randomFrequency
  }

  const getActiveFrequencies = (voice: voice) => {
    
    const activeOctaves = voice.activeOctaves
    const activeNotes   = voice.activeNotes

    let currentFrequencies = allFrequencies.filter((octave, j) => activeOctaves.includes(j.toString()))
    
    let filteredFrequencies = currentFrequencies.map(octave =>
      octave.filter((note, j) => activeNotes.includes((j+1).toString()))
    )

    return filteredFrequencies.flat(Infinity)
  }

  const handleDelete = (i: number) => {
    voices[i].gain?.gain.setValueAtTime(0, 0)
    voices[i].oscillator?.stop()

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
