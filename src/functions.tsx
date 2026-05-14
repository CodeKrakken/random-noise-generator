import { voice } from "./types/voice"

export const setUpVoice = (template: voice | null = null) => {
  return {
    isActive        : false,
    label           : template?.label!+1          ||  1,
    nextInterval    : template?.nextInterval     ??  0,
    bpm             : template?.bpm              ??  60,
    minLevel        : template?.minLevel         ??  100,
    maxLevel        : template?.maxLevel         ??  100,
    activeNotes     : template?.activeNotes      ??  ['1','3','5','6','8','10','12','13'],
    activeOctaves   : template?.activeOctaves    ??  ['4'],
    activeSounds    : template?.activeSounds     ??  ['sine'],
    restChance      : template?.restChance       ??  0,
    activeIntervals : template?.activeIntervals  ??  ['1'],
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

export const setUpSample = (voice: voice, file: string, context: AudioContext, level: number) => {
  voice.sample = new Audio(file)
  voice.sound = context.createMediaElementSource(voice.sample);
  voice.gain  = context.createGain()

  const { sample, sound, gain } = voice
  
  sound.connect(gain)
  gain.gain.setValueAtTime(level, 0)
  gain.connect(context.destination)

  return sample
}