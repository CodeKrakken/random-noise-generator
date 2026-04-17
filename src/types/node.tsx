import { SoundSource } from '../types'

export type node = {
    isActive        : Boolean
    label           : number
    thisInterval?   : number
    nextInterval    : number
    bpm             : number
    minLevel        : number
    maxLevel        : number
    activeNotes     : number[]
    activeScales    : number[]
    activeWaveShapes: string[]
    rest            : number
    activeIntervals : number[]
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