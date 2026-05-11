import { useEffect, useRef, useState } from 'react';
import './App.css';
import Voice from './components/voice/Voice';
import Header from './components/header/Header';
import { voice } from './types/voice'
import { setUpVoice } from './functions';
import Slot from './components/slot/Slot';


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
    voice.nextSlot = context.currentTime
  }

  const start = async () => {
    await setRunning(true)
    voices.forEach((voice, i) => {

      setUpOscillator(voice)
      newSlot(i)
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
    return (timeCode - context.currentTime)*1000
  }

  const newSlot = (i: number) => {

    try {   

      if (isRunning()) {

        const voice = voices[i]
        const slot = voice.nextSlot

        if (isTimeForScheduled(slot)) {
          console.log('Here comes a slot')

          return <>
            <Slot 
              voice={voice}
              length={getSlotLength(i)}
              voices={voices}
              context={context}
            />

            if (voices.length) {
              setTimeout(() => {newSlot(i)}, (voice.nextSlot - context.currentTime)*1000)
            }     
          </>
     

        } else {
          
          setTimeout(() => {newSlot(i)}, (voice.nextSlot - context.currentTime)*1000)
        }
      }
    } catch (error) {}
  }

  const getSlotLength = (i: number) => {
    const liveSlots = voices[i].activeSlots
    const slot = liveSlots[Math.floor(Math.random() * liveSlots.length)] || '0'
    const bpm = voices[i].bpm
    const slotLength  = 60000/bpm * parseFloat(slot)
    return slotLength/1000
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
