import { ChangeEventHandler } from "react"

type InputProps = {
  className         : string  
  'data-voice'?     : number
  'data-attribute'? : string
  type              : string
  // i?                : number
  value             : string | number
  onChange          : ChangeEventHandler
  // maxLength?        : number
  // min?              : number
  // max?              : number
  checked?          : boolean | undefined
}

export type { 
  InputProps 
}