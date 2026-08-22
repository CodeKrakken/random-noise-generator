import { ranges } from "../content/data"
import { SourceGain } from "../Synth/Synth.types"

type RangeKey = typeof ranges[number]

type NumericAttributeKey = 
  'bpm'
| 'restChance'
| `min${RangeKey}`
| `max${RangeKey}`

type ButtonGroupKey = 
  'Notes' 
| 'Octaves' 
| 'Intervals'
| 'Sounds'

type ActiveButtonGroupKey = `active${ButtonGroupKey}`


type Slider = {
  label       : string
  value       : string
  attrName    : string
  min         : number
  max         : number
  row?        : number
  className?  : string
}

type Group = {  
  label       : string
  id          : string  
  buttons?    : string[]  
  className?  : string
  columns?    : number  
}  
  
type VoiceType = {
  id                : string
  isActive          : boolean
  label             : string
  thisInterval?     : number
  offsetInterval?   : number
  nextInterval      : number
  bpm               : number
  minLevel          : number
  maxLevel          : number
  activeNotes       : string[]
  activeOctaves     : string[]
  activeIntervals   : string[]
  activeSounds      : string[]
  activeFrequencies : [] | number[]
  restChance        : number
  minLength         : number
  maxLength         : number
  minOffset         : number
  maxOffset         : number
  minDetune         : number
  maxDetune         : number
  minAttack         : number
  maxAttack         : number
  minDecay          : number
  maxDecay          : number
  colour            : string
}

type HitType = {
  sound?     : string
  frequency? : number
  detune?    : number
  note?      : number | null
  octave?    : number | null
  startTime? : number
  endTime?   : number
  peakStart? : number
  peakEnd?   : number
  level?     : number
  source?    : SourceGain
  voiceId    : string
}

export type {
  RangeKey,
  NumericAttributeKey,
  ButtonGroupKey,
  ActiveButtonGroupKey,
  Slider,
  Group,
  VoiceType,
  HitType
}