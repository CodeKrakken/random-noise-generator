import { useEffect, useRef, useState }  from 'react';
import { Synth }                        from './Synth/Synth';
import { VoiceType }                    from './components/shared.types';
import { demoVoices }                   from './content/data';
import Voice                            from './components/Voice/Voice';
import Header                           from './components/Header/Header';
import './App.css';
import Timeline from './components/Timeline/Timeline';
import { Hit } from './Synth/Synth.types';
import Piano from './components/Piano/Piano';

function App() {

  useEffect(() => {
    Synth.resumeContext()
  }, [])

  const [voices,           setVoices] = useState<VoiceType[]>(demoVoices)
  const [improvising, setImprovising] = useState<boolean>(false)
  const [replaying,     setReplaying] = useState<boolean>(false)
  const [recordedHits, setRecordedHits] = useState<Hit[]>([])

  useEffect(() => {
    Synth.setRecordedHits = setRecordedHits
  }, [])

  const improvisingRef = useRef(improvising)
  const voicesRef = useRef(voices)

  useEffect(() => { 

    voicesRef.current = voices
    if (!voices.length) toggleImprovising(false)   

  }, [voices])


  const handleAddVoice = () => {
    const newVoice = setUpVoice(voices)
    setVoices(voices => [voices, newVoice].flat())
    Synth.add(newVoice, improvising, voicesRef)
  }

  const handleDelete = (i: number) => {  
    const voice = voices[i]  
    voice.isActive = false  
    setVoices(voices => voices.filter((voice, j) => j !== i))  
    Synth.delete(i)  
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
      maxDecay          : template?.maxDecay          ??  100
    }
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
      handleImprov    = {handleImprov}
      improvising     = {improvising}
      replaying       = {replaying}
      handleAddVoice  = {handleAddVoice}
      voices          = {voices}
      loadVoices      = {loadVoices}
      handlePlayback  = {handlePlayback}
      recordedHits    = {Synth.recordedHits}
    />
    
    <div 
      className="row" 
      id="voices"
    >
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

    <div>
      <Timeline hits={recordedHits} />    
    </div>
  </>
} 

export default App;
