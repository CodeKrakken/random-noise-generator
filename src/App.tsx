import { useEffect, useState } from 'react';
import './App.css';
import { allFrequencies } from './content/data'
import snareFile  from './sounds/snare.wav';
import kickFile   from './sounds/kick.wav';
import Voice from './components/voice/Voice';
import Header from './components/header/Header';
import { voice } from './types/voice'

let cycling = false

function App() {

  const [context] = useState(() => new AudioContext())

  const [voices,             setVoices            ] = useState<voice[]>([])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState(false)

  const addVoice = () => {
    setVoices((voices) => [voices, setUpVoice()].flat())
  }

  useEffect(() => {
    if (!active(voices).length) {
      cycling = false
      setCycleButtonLabel(false)
    }
  }, [voices])

  const active = (voices: voice[]) => {
    return voices.filter(voice => voice.isActive)
  }

  const setUpVoice = () => {
    
    const clonedVoice = active(voices).reverse()[0]

    return {
      isActive        : true,
      label           : clonedVoice?.label+1          ||  1,
      nextInterval    : 0,
      bpm             : clonedVoice?.bpm              ??  120,
      minLevel        : clonedVoice?.minLevel         ??  100,
      maxLevel        : clonedVoice?.maxLevel         ??  100,
      activeNotes     : clonedVoice?.activeNotes      ??  ['1','3','5','6','8','10','12','13'],
      activeOctaves   : clonedVoice?.activeOctaves    ??  ['4'],
      activeWaveforms : clonedVoice?.activeWaveforms  ??  ['sine'],
      restChance      : clonedVoice?.restChance       ??  0,
      activeIntervals : clonedVoice?.activeIntervals  ??  ['0.5'],
      minLength       : clonedVoice?.minLength        ??  100,
      maxLength       : clonedVoice?.maxLength        ??  100,
      minOffset       : clonedVoice?.minOffset        ??  0,  
      maxOffset       : clonedVoice?.maxOffset        ??  0,
      minDetune       : clonedVoice?.minDetune        ??  0,
      maxDetune       : clonedVoice?.maxDetune        ??  0,
      minFadeIn       : clonedVoice?.minFadeIn        ??  100,
      maxFadeIn       : clonedVoice?.maxFadeIn        ??  100,
      minFadeOut      : clonedVoice?.minFadeOut       ??  100,
      maxFadeOut      : clonedVoice?.maxFadeOut       ??  100,
    }
  }

  const setUpSample = (file: string) => {
    const sample = new Audio(file)
    const sound = context.createMediaElementSource(sample);
    sound.connect(context.destination)
    return sample
  }

  const snareSample = setUpSample(snareFile)
  const kickSample  = setUpSample(kickFile)

  const handleStartStop = () => {
    cycling = !cycling
    cycling ? start() : stop()
  }

  const start = () => {
    setCycleButtonLabel(true)
    
    voices.forEach((voice, i) => {
      if (voice.isActive) {

        const oscillator  = context.createOscillator()
        const gain        = context.createGain()
    
        oscillator.connect(gain);
        gain.connect(context.destination);
        gain.gain.setValueAtTime(0, 0)
        oscillator.start(0);

        voice.oscillator = oscillator
        voice.gain       = gain

        voice.nextInterval = context.currentTime

        newInterval(i)
      }
    })
  }

  const stop = async () => {
    setCycleButtonLabel(false) 
    await active(voices).forEach(voice => {
      voice.gain?.gain.setValueAtTime(0, context.currentTime)
      voice.oscillator?.stop()
    })

  }

  const newInterval = (i: number) => {
    const voice = voices[i]
    if (cycling && document.querySelectorAll(`[data-attribute="Intervals"][data-voice="${i}"]`))  {
      if (context.currentTime >= voices[i].nextInterval) {
        const intervalLength = getIntervalLength(i)
        voices[i].thisInterval = voices[i].nextInterval
        voices[i].nextInterval += intervalLength
        const liveWaves = Array.from(document.querySelectorAll(`[data-attribute="Waveforms"][data-voice="${i}"]`)).filter(
          (wave): wave is HTMLInputElement => wave instanceof HTMLInputElement && wave.checked
        )
        if (isRest(i) || !liveWaves) {
          voices[i].gain?.gain.setValueAtTime(0,0)

        } else {          

          const minLevel  = Number(document.querySelector<any>(`[data-attribute="minLevel"][data-voice="${i}"]`)!.value)
          const maxLevel  = Number(document.querySelector<any>(`[data-attribute="maxLevel"][data-voice="${i}"]`)!.value)
          const minLength = Number(document.querySelector<any>(`[data-attribute="minLength"][data-voice="${i}"]`)!.value)
          const maxLength = Number(document.querySelector<any>(`[data-attribute="maxLength"][data-voice="${i}"]`)!.value)
          const offset = getRangeValue('Offset', i)
          let noteLength = intervalLength
          setTimeout(async () => {
            if (!liveWaves.length) return
            const randomWave = liveWaves[Math.floor(Math.random() * liveWaves.length)]
            const waveShape = randomWave.value
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
                const fadeInPercentage  = getRangeValue('FadeIn' , i)
                const fadeOutPercentage = getRangeValue('FadeOut', i)

                const peakPercentage    = (fadeInPercentage/(fadeInPercentage+fadeOutPercentage)) * 100 ||  0
                const level       = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/voices.filter(voice => voice.nextInterval).length
                if (noteLength < intervalLength) {
                  setTimeout(() => {voices[i].gain?.gain.setValueAtTime(0, context.currentTime)}, noteLength*1000)
                }

                if (cycling) {
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
        if (document.querySelector(`[data-attribute="Voices"][data-voice="${i}"]`)) {
          setTimeout(() => {newInterval(i)}, (voices[i].nextInterval - context.currentTime)*1000)
        }

      } else {

        setTimeout(() => {newInterval(i)}, (voices[i].nextInterval - context.currentTime)*1000)
      }
    }
  }

  const getIntervalLength = (i: number) => {
    const liveIntervals = Array.from(document.querySelectorAll(`[data-attribute="Intervals"][data-voice="${i}"]`)).filter( 
      (interval): interval is HTMLInputElement => interval instanceof HTMLInputElement && interval.checked
    )
    let interval = liveIntervals[Math.floor(Math.random() * liveIntervals.length)]?.value || '0'
    const intervalBpmAdjuster = 4
    const bpm  = document.querySelector<any>(`[data-attribute="bpm"][data-voice="${i}"]`)!.value
    const intervalLength  = 60000/bpm * parseFloat(interval) * intervalBpmAdjuster
    return intervalLength/1000
  }
       
  const isRest = (i: number) => {
    const restChance  = Number(document.querySelector<any>(`[data-attribute="restChance"][data-voice="${i}"]`)!.value/100)
    console.log(restChance)
    const diceRoll = Math.random()
    console.log(diceRoll)
    return diceRoll < restChance
  }

  const getRangeValue = (key: string, i:number) => {
    const minEl = document.querySelector(`[data-attribute="min${key}"][data-voice="${i}"]`) 
    const maxEl = document.querySelector(`[data-attribute="max${key}"][data-voice="${i}"]`) 
    const minValue = minEl instanceof HTMLInputElement ? +minEl.value : 0
    const maxValue = maxEl instanceof HTMLInputElement ? +maxEl.value : 100
    return minValue + (Math.random() * (maxValue - minValue))
  }

  const detune = (frequency: number, i: number) => {
    const detune = getRangeValue('Detune', i)
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
    
    const activeOctaves  = Array.from(document.querySelectorAll(`[data-attribute="Octaves"][data-voice="${i}"]`)).filter( 
      (octave): octave is HTMLInputElement => octave instanceof HTMLInputElement && octave.checked    
    ).map(octave => { return +octave.value})
    const activeNotes   = Array.from(document.querySelectorAll(`[data-attribute="Notes"][data-voice="${i}"]`)).filter( 
      (note): note is HTMLInputElement => note instanceof HTMLInputElement && note.checked
    ).map(note => { return +note.value})
    let currentFrequencies = allFrequencies.filter((octave, j) => activeOctaves.includes(j))
    
    let filteredFrequencies = currentFrequencies.map(octave =>
      octave.filter((note, j) => activeNotes.includes(j+1))
    )

    return filteredFrequencies.flat(Infinity)
  }

  const handleDelete = (i: number) => {
    voices[i].gain?.gain.setValueAtTime(0, 0)
    voices[i].oscillator?.stop()

    setVoices(voices.map((voice, j) => i !== j ? voice : {...voice, isActive: false}))
  }

  return <>
    <br />
    <Header 
      handleStartStop   = {handleStartStop}
      cycleButtonLabel  = {cycleButtonLabel}
      addVoice           = {addVoice}
      showStart         = {Boolean(active(voices).length)}
    />

    <br />
    <br />
    {
      voices.map((voice, i) => 
        voice.isActive &&
        <Voice 
          voice         = {voice} 
          i             = {i} 
          setVoices     = {setVoices} 
          voices        = {voices}
          handleDelete  = {handleDelete}
          key           = {i}
          dataVoice     = {i}
          dataAttribute = "Voices"
        />
      )
    }
  </>
}

export default App;
