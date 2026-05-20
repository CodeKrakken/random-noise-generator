import { ChangeEventHandler } from "react"

type InputProps = {
  className         : string  
  'data-voice'      : number
  'data-attribute'  : string
  type              : string
  value             : string | number
  onChange          : ChangeEventHandler
  checked?          : boolean | undefined
}

export type { 
  InputProps 
}