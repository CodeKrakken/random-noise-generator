import { useEffect, useRef, useState } from 'react';
import './App.css';
import { allFrequencies } from './content/data'
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

  const newInterval = (i: number) => {
    try {   
      const voice = voices[i]
      if (runningRef.current) {
        if (context.currentTime >= voices[i].nextInterval) {
          const intervalLength = getIntervalLength(i)
          voices[i].thisInterval = voices[i].nextInterval
          voices[i].nextInterval += intervalLength
          
          const liveWaves = voices[i].activeWaveforms
          if (isRest(i) || !liveWaves) {
            voices[i].gain?.gain.setValueAtTime(0,0)

          } else {          

            const minLevel  = voices[i].minLevel
            const maxLevel  = voices[i].maxLevel
            const minLength = voices[i].minLength
            const maxLength = voices[i].maxLength
            const offset = getRangeValue('Offset', voices[i])
            let noteLength = intervalLength
            setTimeout(() => {
              if (!liveWaves.length) return
              const randomWave = liveWaves[Math.floor(Math.random() * liveWaves.length)]
              const waveShape = randomWave
              if (voice.oscillator) voice.oscillator.type = waveShape as OscillatorType

              if (
                [
                  'sine',
                  'triangle',
                  'sawtooth',
                  'square',
                ]
                .includes(waveShape)
              ) {
                try {
                  const randomFrequency = getRandomFrequency(i)
                  const frequency   = detune(randomFrequency as number, i)
                  if (voice.oscillator) voice.oscillator.frequency.value = frequency

                  const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
                  noteLength = intervalLength / 100 * noteLengthPercentage
                  const fadeInPercentage  = getRangeValue('FadeIn' , voices[i])
                  const fadeOutPercentage = getRangeValue('FadeOut', voices[i])
                  const peakPercentage    = (fadeInPercentage/(fadeInPercentage+fadeOutPercentage)) * 100 ||  0
                  const level       = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/voices.filter(voice => voice.nextInterval).length
                  if (noteLength < intervalLength) {
                    setTimeout(() => {voices[i].gain?.gain.setValueAtTime(0, context.currentTime)}, noteLength*1000)
                  }

                    const fadeInDuration  = noteLength  / 100 * fadeInPercentage
                    const fadeOutDuration = noteLength  / 100 * fadeOutPercentage
                    const startOfFadeOut  = voices[i].nextInterval - fadeOutDuration
                    const endOfFadeIn     = voice.thisInterval ? voice.thisInterval + fadeInDuration : fadeInDuration

                    const peakPoint       = voice.thisInterval ? 
                                            voice.thisInterval + noteLength * peakPercentage / 100 : 
                                            noteLength * peakPercentage / 100

                    if (endOfFadeIn <= startOfFadeOut) {

                      voice.gain?.gain.setValueAtTime(voice.gain.gain.value, 0)
                      voices[i].gain?.gain.linearRampToValueAtTime(level, endOfFadeIn)
                      voices[i].gain?.gain.setValueAtTime(level, startOfFadeOut)
                      voices[i].gain?.gain.linearRampToValueAtTime(0, voices[i].nextInterval)

                    } else {

                      voice.gain?.gain.setValueAtTime(voice.gain.gain.value, 0)
                      voices[i].gain?.gain.linearRampToValueAtTime(level, peakPoint)
                      voices[i].gain?.gain.setValueAtTime(level, peakPoint)
                      voices[i].gain?.gain.linearRampToValueAtTime(0, voices[i].nextInterval)

                    }
                } catch (error: unknown) {

                  console.error(error instanceof Error ? error.message : "Unknown error", error)
                  
                }
              } else {
                try {

                  if (voice.oscillator) voice.oscillator.frequency.value = 0
                  if (waveShape === 'kick'  ) {kickSample.play()}
                  if (waveShape === 'snare' ) {snareSample.play()}

                } catch (error: unknown) {

                  console.error(error instanceof Error ? error.message : "Unknown error", error)
                }
              }            
            }, offset * 10 * intervalLength)
          }
          if (voices.length) {
            setTimeout(() => {newInterval(i)}, (voices[i].nextInterval - context.currentTime)*1000)
          }          

        } else {

          setTimeout(() => {newInterval(i)}, (voices[i].nextInterval - context.currentTime)*1000)
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
    const restChance  = voices[i].restChance
    const diceRoll = Math.random()
    return diceRoll < restChance
  }

  const getRangeValue = (key: string, voice: voice) => {
    const minEl = voice[`min${key}` as keyof voice] ?? 0
    const maxEl = voice[`max${key}` as keyof voice] ?? 100

    return minEl as number + (Math.random() * (maxEl as number - (minEl as number)))
  }

  const detune = (frequency: number, i: number) => {
    const detune = getRangeValue('Detune', voices[i])
    const ratio = 105.94637142137626184333
    const semitoneUp = frequency / 100 * ratio
    const hzDiff = semitoneUp - frequency
    return frequency + hzDiff / 100 * detune
  }

  const getRandomFrequency = (i: number) => {
    let activeFrequencies = getActiveFrequencies(i) 

    const randomIndex = Math.floor(Math.random()*activeFrequencies.length)

    return activeFrequencies[randomIndex]
  }

  const getActiveFrequencies = (i: number) => {
    
    const activeOctaves = voices[i].activeOctaves
    const activeNotes   = voices[i].activeNotes

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
