import { Compound, Atom, voice, AtomicField } from "../../types/voice"

export const updateField = (
  e: any, 
  attribute: Atom | AtomicField, 
  voices: voice[], 
  i: number,
  callback: Function
) => {
  voices[i][attribute] = +e.target!.value
  updateVoice(voices, i, callback)
} 

export const updateCheckbox = (
  e: any, 
  attribute: Compound, 
  voices: voice[], 
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

export  const updateVoice = (array: voice[], i: number, callback: Function) => {
  callback([array.slice(0,i), array[i], array.slice(i+1)].flat())
}