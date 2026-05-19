import { useEffect, useRef, useState } from 'react';
import './App.css';
import { waveforms } from './content/data'
import Voice from './components/Voice/Voice';
import Header from './components/Header/Header';
import { Voice } from './components/Voice/Voice.types'
import { setUpVoice, firstInterval, stopOne } from './App.functions';
import { Waveform } from './App.types';


function App() {

  // state

  const [context] = useState(() => new AudioContext())
  const [voices,  setVoices] = useState<Voice[]>([])
  const [running, setRunning] = useState<boolean>(false)

  // refs

  const runningRef = useRef(false)
  const voicesRef = useRef(voices)

  // effect

  useEffect(() => { 

    voicesRef.current = voices
    if (!voices.length) toggleRunning(false)   

  }, [voices])

  // functions

  const handleAddVoice = () => {
    const newVoice = setUpVoice(voices[voices.length - 1])
    const nextInterval = voices[voices.length -1]?.nextInterval
    if (running) firstInterval(newVoice, nextInterval, runningRef, voicesRef, waveforms as Waveform[], context)
    setVoices(voices => [voices, newVoice].flat())
  }

  const handleDelete = (i: number) => {

    const voice = voices[i]

    voice.isActive = false

    setVoices(voices =>
      voices.filter((voice, j) => j !== i)
    )
  }

  const handleStartStop = () => runningRef.current ? stopAll(voices) : start()

  const start = async () => {
    toggleRunning(true)
    voices.forEach(voice => firstInterval(voice, context.currentTime, runningRef, voicesRef, waveforms as Waveform[], context))
  }

  const stopAll = (voices: Voice[]) => {
    toggleRunning(false)
    voices.forEach(voice => stopOne(voice))
  }

  const toggleRunning = (state: boolean) => {
    runningRef.current = state
    setRunning(state)
  }


  return <>
    <br />
    <Header 
      handleStartStop = {handleStartStop}
      running         = {running}
      handleAddVoice  = {handleAddVoice}
      showStart       = {Boolean(voices.length)}
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
