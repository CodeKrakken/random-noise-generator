type OscillatorSource = {
  kind: "oscillator"
  wave: OscillatorType
}

type SampleSource = {
  kind: "sample"
  name: "kick" | "snare"
  buffer: AudioBuffer
}

type Voice = {
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
  restChance      : number
  activeIntervals : string[]
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
  oscillator?     : OscillatorNode
  gain?           : GainNode
  source?         : OscillatorSource | SampleSource
  sample?         : HTMLAudioElement
  sound?          : MediaElementAudioSourceNode
}

type VoiceProps = {
  i           : number, 
  setVoices   : Function, 
  voices      : Voice[], 
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
  Voice,
  VoiceProps,
  Compound
}