import { voice } from "./types/voice"

export const setUpVoice = (template: voice | null = null) => {
  return {
    label           : template?.label!+1          ||  1,
    nextSlot    : 0,
    bpm             : template?.bpm              ??  120,
    minLevel        : template?.minLevel         ??  100,
    maxLevel        : template?.maxLevel         ??  100,
    activeNotes     : template?.activeNotes      ??  ['1','3','5','6','8','10','12','13'],
    activeOctaves   : template?.activeOctaves    ??  ['4'],
    activeWaveforms : template?.activeWaveforms  ??  ['sine'],
    restChance      : template?.restChance       ??  0,
    activeSlots : template?.activeSlots  ??  ['0.5'],
    minLength       : template?.minLength        ??  100,
    maxLength       : template?.maxLength        ??  100,
    minOffset       : template?.minOffset        ??  0,  
    maxOffset       : template?.maxOffset        ??  0,
    minDetune       : template?.minDetune        ??  0,
    maxDetune       : template?.maxDetune        ??  0,
    minFadeIn       : template?.minFadeIn        ??  100,
    maxFadeIn       : template?.maxFadeIn        ??  100,
    minFadeOut      : template?.minFadeOut       ??  100,
    maxFadeOut      : template?.maxFadeOut       ??  100,
  }
}

export const setUpSample = (file: string, context: AudioContext) => {
  const sample = new Audio(file)
  const sound = context.createMediaElementSource(sample);
  sound.connect(context.destination)
  return sample
}