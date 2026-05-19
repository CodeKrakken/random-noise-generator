import { Compound, VoiceType } from "./Voice.types"
import { Atom } from "../shared.types"


export const updateField = (
  e: React.ChangeEvent<HTMLInputElement>, 
  attribute: Atom,
  voices: VoiceType[], 
  i: number,
  callback: Function
) => {
  voices[i][attribute] = +e.target!.value
  updateVoice(voices, i, callback)
} 

export const updateCheckbox = (
  e: React.ChangeEvent<HTMLInputElement>, 
  attribute: Compound, 
  voices: VoiceType[], 
  i: number, 
  callback: Function
) => {

  if ((voices[i][attribute]).includes(e.target.value)) {
    voices[i][attribute] = voices[i][attribute].filter(value => value !== e.target.value)
  } else {
    voices[i][attribute] = [voices[i][attribute], e.target.value].flat()
  }
  
  updateVoice(voices, i, callback)
}

export  const updateVoice = (array: VoiceType[], i: number, callback: Function) => {
  callback([array.slice(0,i), array[i], array.slice(i+1)].flat())
}