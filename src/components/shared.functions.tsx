import { allFrequencies }                   from "../content/data"
import { Synth }                            from "../Synth/Synth"
import { buffers } from "../Synth/Synth.functions"
import { ActiveButtonGroupKey, VoiceType }  from "./shared.types"

const getActiveFrequencies = (voice: VoiceType) => {
  
  const { activeOctaves, activeNotes } = voice

  let allFrequenciesInOctaves = allFrequencies.filter(
    (octave, i) => activeOctaves.includes(String(i))
  )

  let activeFrequencies = allFrequenciesInOctaves.map(octave =>
    octave.filter((note, i) => activeNotes.includes(String(i+1)))
  )

  return activeFrequencies.flat(Infinity)
}

const updateButton = (

  e         : React.MouseEvent<HTMLButtonElement>, 
  attribute : ActiveButtonGroupKey, 
  voices    : VoiceType[], 
  i         : number, 
  setVoices : React.Dispatch<React.SetStateAction<VoiceType[]>>

) => {

  voices[i][attribute].includes(e.currentTarget.value as any) 
  ? voices[i][attribute] = voices[i][attribute].filter(value => value !== e.currentTarget.value)
  : voices[i][attribute] = [voices[i][attribute], e.currentTarget.value].flat()

  if (attribute === 'activeSounds' && voices[i].activeSounds.includes(e.currentTarget.value)) {  
    const buf = buffers[e.currentTarget.value]  
    if (buf?.note != null && buf?.octave != null) {  
      voices[i].activeNotes   = [String(buf.note + 1)]  
      voices[i].activeOctaves = [String(buf.octave)]  
    }  
  }
  
  updateVoice(voices, i, setVoices)
}

const updateVoice = (

  voices: VoiceType[], 
  i: number, 
  setVoices: Function

) => {

  const voice = voices[i]
  voice.activeFrequencies = getActiveFrequencies(voice) as number[]
  setVoices([voices.slice(0,i), voice, voices.slice(i+1)].flat())
  Synth.update(voice, i)
}

export {
  updateVoice,
  updateButton,
  getActiveFrequencies
}