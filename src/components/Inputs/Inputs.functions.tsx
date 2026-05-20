import { Atom }                 from "../shared.types"
import { Compound, VoiceType }  from "../Voice/Voice.types"


const updateField = (
  e: React.ChangeEvent<HTMLInputElement>, 
  attribute: Atom,
  voices: VoiceType[], 
  i: number,
  setVoices: Function
) => {
  voices[i][attribute] = +e.target!.value
  updateVoice(voices, i, setVoices)
} 


const updateCheckbox = (
  e: React.ChangeEvent<HTMLInputElement>, 
  attribute: Compound, 
  voices: VoiceType[], 
  i: number, 
  setVoices: Function
) => {

  if ((voices[i][attribute]).includes(e.target.value)) {
    voices[i][attribute] = voices[i][attribute].filter(value => value !== e.target.value)
  } else {
    voices[i][attribute] = [voices[i][attribute], e.target.value].flat()
  }
  
  updateVoice(voices, i, setVoices)
}

// private

const updateVoice = (array: VoiceType[], i: number, setVoices: Function) => {
  setVoices([array.slice(0,i), array[i], array.slice(i+1)].flat())
}


export {
  updateCheckbox,
  updateField
}