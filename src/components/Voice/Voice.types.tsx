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
  activeIntervals : string[]
  activeSounds    : string[]
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
}

type VoiceProps = {
  i             : number, 
  setVoices     : Function, 
  voices        : VoiceType[], 
  handleDelete  : Function
  dataAttribute : string
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