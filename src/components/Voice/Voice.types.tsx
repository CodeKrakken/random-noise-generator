type VoiceType = {
  isActive        : boolean
  label           : number
  thisInterval?   : number
  nextInterval    : number
  bpm             : number
  minLevel        : number
  maxLevel        : number
  activeNotes     : string[]
  activeOctaves   : string[]
  activeSounds    : string[]
  activeIntervals : string[]
  restChance      : number
  minLength       : number
  maxLength       : number
  minOffset       : number
  maxOffset       : number
  minDetune       : number
  maxDetune       : number
  minFadeIn       : number
  maxFadeIn       : number
  minFadeOut      : number
  maxFadeOut      : number
  source?         : {}
  sample?         : HTMLAudioElement
  sound?          : MediaElementAudioSourceNode
}

type VoiceProps = {
  i           : number, 
  setVoices   : Function, 
  voices      : VoiceType[], 
  handleDelete: Function
  dataVoice?     : number,
  dataAttribute? : string
}

type Compound = 
  'activeNotes'
| 'activeOctaves'
| 'activeIntervals'
| 'activeSounds'

export type {
  VoiceType,
  VoiceProps,
  Compound
}