import { ranges } from "../../content/data"
import { voice } from "../voice/types"

export type InputsProps = {
  i: number
  voices: voice[]
  setVoices: Function
}

export type CheckboxGroup = 
  'Octaves' 
| 'Notes' 
| 'Sounds' 
| 'Intervals'

export type Atom = 
  'label'
| 'bpm'
| 'restChance'
| `min${Range}`
| `max${Range}`

type Range = typeof ranges[number]
