import { useEffect, useRef, useState }  from 'react';
import { Synth }                        from './Synth/Synth';
import { VoiceType, HitType }           from './components/shared.types';
import { demoVoices, intervals, notes, octaves, sounds }                   from './content/data';
import Voice                            from './components/Voice/Voice';
import Header                           from './components/Header/Header';
import './App.css';
import Timeline from './components/Timeline/Timeline';
import { getActiveFrequencies } from './components/shared.functions';

function App() {

  useEffect(() => {
    Synth.resumeContext()
  }, [])

  const [voices,           setVoices] = useState<VoiceType[]>(demoVoices)
  const [improvising, setImprovising] = useState<boolean>(false)
  const [replaying,     setReplaying] = useState<boolean>(false)
  const [recordedHits, setRecordedHits] = useState<HitType[]>([])

  useEffect(() => {
    Synth.setRecordedHits = setRecordedHits
  }, [])

  const improvisingRef = useRef(improvising)
  const voicesRef = useRef(voices)

  useEffect(() => { 

    voicesRef.current = voices
    if (!voices.length) toggleImprovising(false)   

  }, [voices])

  useEffect(() => {

    const voices = document.querySelector('#voices')

    if (!voices) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      voices.scrollLeft += e.deltaX + e.deltaY
    }
    

    voices.addEventListener('wheel' as any, handleWheel, { passive: false })     // Fix this later

    const header = document.querySelector('#header')

    if (!header) return

    const handleHeaderWheel = (e: WheelEvent) => {
      e.preventDefault()
    }

    header.addEventListener('wheel' as any, handleHeaderWheel, { passive: false })    // Fix this later
    
    return () => {

      voices.removeEventListener('wheel' as any, handleWheel)    // Fix this later
      header.removeEventListener('wheel' as any, handleHeaderWheel)    // Fix this later
    }

  }, [])


  const handleAddVoice = () => {
    const newVoice = setUpVoice(voices)
    setVoices(voices => [voices, newVoice].flat())
    Synth.add(newVoice, improvising, voicesRef)
  }

  const handleDelete = (id: string) => {  
    const voice = voices.find(v => v.id === id)  
    if (!voice) return  
    voice.isActive = false  
    setVoices(voices => voices.filter((voice, j) => voice.id !== id))  
    Synth.delete(voice.id)  
  }

  const startImprovising = () => {
    toggleImprovising(true)
    Synth.start(voicesRef)
  }

  const stopImprovising = () => {
    toggleImprovising(false)
    Synth.stop()
  }

  const stopPlayback = () => {
    toggleReplaying(false)
    Synth.stop()
  }

  const startPlayback = () => {
    toggleReplaying(true)
    Synth.replay(setReplaying)
  }

  const toggleReplaying = (state: boolean) => {
    setReplaying(state)
  }

  const toggleImprovising = (state: boolean) => {
    improvisingRef.current = state
    setImprovising(state)
  }

  const loadVoices = () => {

    const loadedVoices = JSON.parse(localStorage.voices)
    setVoices(loadedVoices)
    Synth.voices = []

    loadedVoices.forEach((voice: VoiceType) => {
      Synth.add(voice, improvising, voicesRef)
    })
  }

  const handleImprov = () => improvising ? stopImprovising() : startImprovising()

  const handlePlayback = () => replaying ? stopPlayback() : startPlayback()
  
  const handleRandomiseVoices = () => {
    const numberOfVoices = Math.floor(Math.random() * 9) + 3
    const bpm = Math.floor(Math.random() * 120) + 60

    const randomVoices = []

    for (let i = 0; i < numberOfVoices; i++) {
      randomVoices.push(randomVoice(voices, bpm))
    }
    setVoices(randomVoices)
  }

  const randomVoice = (voices: VoiceType[], bpm: number) => {

    const template = voices[voices.length - 1]
    
    const randomVoice = {
      id                : crypto.randomUUID(),
      isActive          : false,
      label             : generateNewLabel(template, voices),
      nextInterval      : 0,
      bpm               : bpm,
      minLevel          : Math.floor(Math.random() * 100),
      maxLevel          : Math.floor(Math.random() * 100),
      activeNotes       : randomItemsFrom(notes),
      activeOctaves     : randomItemsFrom(octaves),
      activeFrequencies : [],
      activeIntervals   : randomItemsFrom(intervals),
      activeSounds      : randomItemsFrom(sounds),
      restChance        : Math.floor(Math.random() * 100),
      minLength         : Math.floor(Math.random() * 100),
      maxLength         : Math.floor(Math.random() * 100),
      minOffset         : template?.minOffset         ??  0,  
      maxOffset         : template?.maxOffset         ??  0,
      minDetune         : template?.minDetune         ??  0,
      maxDetune         : template?.maxDetune         ??  0,
      minAttack         : Math.floor(Math.random() * 100),
      maxAttack         : Math.floor(Math.random() * 100),
      minDecay          : Math.floor(Math.random() * 100),
      maxDecay          : Math.floor(Math.random() * 100),
      colour            : randomColour()
    }

    return randomVoice

    // randomVoice.activeFrequencies = getActiveFrequencies(randomVoice)
  }

  const randomItemsFrom = (options: string[]) => {
    const numberOfItems = Math.floor(Math.random() * options.length)
    const items = []

    for (let i = 0; i < numberOfItems; i++) {

      const j = Math.floor(Math.random() * options.length)
      const selection = options.splice(j)
      items.push(selection)
    }

    return items
  }

  const setUpVoice = (voices: VoiceType[]) => {

    const template = voices[voices.length - 1]
    
    return {
      id                : crypto.randomUUID(),
      isActive          : false,
      label             : generateNewLabel(template, voices),
      nextInterval      : template?.nextInterval      ||  0,
      bpm               : template?.bpm               ??  120,
      minLevel          : template?.minLevel          ??  100,
      maxLevel          : template?.maxLevel          ??  100,
      activeNotes       : template?.activeNotes       ??  ['1','3','5','6','8','10','12','13'],
      activeOctaves     : template?.activeOctaves     ??  ['4'],
      activeFrequencies : template?.activeFrequencies ??  [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
      activeIntervals   : template?.activeIntervals   ??  ['1'],
      activeSounds      : template?.activeSounds      ??  ['sine'],
      restChance        : template?.restChance        ??  0,
      minLength         : template?.minLength         ??  100,
      maxLength         : template?.maxLength         ??  100,
      minOffset         : template?.minOffset         ??  0,  
      maxOffset         : template?.maxOffset         ??  0,
      minDetune         : template?.minDetune         ??  0,
      maxDetune         : template?.maxDetune         ??  0,
      minAttack         : template?.minAttack         ??  100,
      maxAttack         : template?.maxAttack         ??  100,
      minDecay          : template?.minDecay          ??  100,
      maxDecay          : template?.maxDecay          ??  100,
      colour            : randomColour()
    }
  }

  const randomColour = () => {

    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    return `rgba(${r}, ${g}, ${b})`
  }

  const generateNewLabel = (
    template: VoiceType | null, 
    voices: VoiceType[]
  ) => {

    let newLabel: string

    if (!template) {
      newLabel = '1'
    } else if (+template.label) {
      newLabel = String(+template.label+1)  
    } else {
      newLabel = String(
        voices.map(voice => +voice.label).filter(
          label => !isNaN(label)
        ).sort((a, b) => b - a)[0] + 1 || 1
      )
    }

    return newLabel
  }


  return <>

    <Header 
      handleImprov          = {handleImprov}
      improvising           = {improvising}
      replaying             = {replaying}
      handleAddVoice        = {handleAddVoice}
      handleRandomiseVoices = {handleRandomiseVoices}
      voices                = {voices}
      loadVoices            = {loadVoices}
      handlePlayback        = {handlePlayback}
      recordedHits          = {Synth.recordedHits}
    />
    
    <div 
      id="voices-container"
    >
      <div id="voices">
        <div className="row">
          {
            voices.map((voice, i) => 

              <Voice
                i             = {i} 
                setVoices     = {setVoices} 
                voices        = {voices}
                handleDelete  = {handleDelete}
                dataAttribute = "Voices"
                key           = {voice.id}
              />
            )
          }
        </div>
      </div>
    </div>

    <div>
      <Timeline 
        hits={recordedHits} 
        voices={voices}
      />    
    </div>
  </>
} 

export default App;
