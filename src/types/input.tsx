import { ChangeEventHandler } from "react"

export type InputProps = {
  className     : string  
  title         : string
  label?        : string
  id?           : string
  i?            : number
  type          : string
  value         : string | number
  onChange      : ChangeEventHandler
  maxLength?    : number
  min?          : number
  max?          : number
  checked?      : boolean | undefined
  'data-voice'?     : number
  'data-attribute'? : string
}