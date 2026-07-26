import { useEffect, useRef, useState } from 'react';
import './App.css';
import Interface from './components/Interface/Interface';
import { Synth } from './Synth/Synth';
import { setUpVoice } from './components/Interface/Interface.functions';
import { VoiceType } from './components/shared.types';
import { demoVoices } from './content/data';

function App() {

  useEffect(() => {
    Synth.resumeContext()
  }, [])

  const [voices,  setVoices] = useState<VoiceType[]>(demoVoices)
  const [running, setRunning] = useState<boolean>(false)

  const runningRef = useRef(running)
  const voicesRef = useRef(voices)

  useEffect(() => { 

    voicesRef.current = voices
    if (!voices.length) toggleRunning(false)   

  }, [voices])


  const handleAddVoice = () => {
    const newVoice = setUpVoice(voices)
    setVoices(voices => [voices, newVoice].flat())
    Synth.add(newVoice, running, voicesRef)
  }

  const handleDelete = (i: number) => {  
    const voice = voices[i]  
    voice.isActive = false  
    setVoices(voices => voices.filter((voice, j) => j !== i))  
    Synth.delete(i)  
  }

  const start = () => {
    toggleRunning(true)
    Synth.start(voicesRef)
  }

  const stopAll = () => {
    toggleRunning(false)
    Synth.stop()
  }

  const toggleRunning = (state: boolean) => {
    runningRef.current = state
    setRunning(state)
  }

  const loadVoices = () => {

    const loadedVoices = JSON.parse(localStorage.voices)
    setVoices(loadedVoices)
    Synth.voices = []

    loadedVoices.forEach((voice: VoiceType) => {
      Synth.add(voice, running, voicesRef)
    })
  }

  return <>
    <Interface 
      running         = {running}
      stopAll         = {stopAll}
      start           = {start}
      handleAddVoice  = {handleAddVoice}
      voices          = {voices}
      loadVoices      = {loadVoices}
      setVoices       = {setVoices}
      handleDelete    = {handleDelete}
    />
  </>
}

export default App;
