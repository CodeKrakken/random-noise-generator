import { VoiceType } from "../components/shared.types"

type VoicesRef = { current: VoiceType[] }


type Hit = {
  sound?     : string
  frequency? : number
  startTime? : number
  endTime?   : number
  peakStart? : number
  peakEnd?   : number
  level?     : number
  note?      : number | null
  octave?    : number | null
  detune?    : number
}


export type {
  VoicesRef,
  Hit
}