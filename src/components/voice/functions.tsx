import { Compound, Scalar, voice } from "../../types/voice"

export const updateAttribute = (
    e: any, 
    attribute: Scalar, 
    voices: voice[], 
    i: number,
    callbackFunction: Function
) => {
    voices[i][attribute] = +e.target!.value
    callbackFunction()
} 

export const updateCheckbox = (
    e: any, 
    attribute: Compound, 
    voices: voice[], 
    i: number, 
    callbackFunction: Function
) => {

    if ((voices[i][attribute]).includes(e.target.value)) {
      voices[i][attribute] = voices[i][attribute].filter(value => value !== e.target.value)
    } else {
      voices[i][attribute] = [voices[i][attribute], e.target.value].flat()
    }
    
    callbackFunction()
}

export  const updateVoice = (array: voice[], i: number, callback: Function) => {
    callback([array.slice(0,i), array[i], array.slice(i+1)].flat())
}