import { SoundSource } from '../types'
import { ranges } from '../content/data'

export type voice = {
  isActive        : Boolean
  label           : number
  thisInterval?   : number
  nextInterval    : number
  bpm             : number
  minLevel        : number
  maxLevel        : number
  activeNotes     : string[]
  activeOctaves   : string[]
  activeWaveShapes: string[]
  rest            : number
  activeIntervals : string[]
  minNoteLength   : number
  maxNoteLength   : number
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
  source?         : SoundSource
}

export type props = {
  voice       : voice, 
  i           : number, 
  setVoices   : Function, 
  voices      : voice[], 
  handleDelete: Function
}

type Range = typeof ranges[number]

export type Scalar = 
  'label'
| 'bpm'
| 'rest'
| `min${Range}`
| `max${Range}`

export type Compound = 
  'activeNotes'
| 'activeOctaves'
| 'activeIntervals'
| 'activeWaveShapes'