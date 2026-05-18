import { ranges } from "../content/data"

type Range = typeof ranges[number]

type Atom = 
  'label'
| 'bpm'
| 'restChance'
| `min${Range}`
| `max${Range}`


type CheckboxGroup = 
  'Octaves' 
| 'Notes' 
| 'Sounds' 
| 'Intervals'

export type {
  Atom,
  CheckboxGroup
}