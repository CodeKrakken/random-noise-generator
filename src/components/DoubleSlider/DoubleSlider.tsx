import { useEffect, useRef }                      from "react";
import { NumericAttributeKey, Slider, VoiceType } from "../shared.types";  
import RangeSlider, { ReactRangeSliderInputRef }  from 'react-range-slider-input';  
import 'react-range-slider-input/dist/style.css';  

export default function DoubleSlider ({  
  
  slider,  
  i,  
  voices,  
  setVoices  

}: {  

  slider    : Slider  
  i         : number  
  voices    : VoiceType[]  
  setVoices : React.Dispatch<React.SetStateAction<VoiceType[]>>

}) {  

  const sliderRef = useRef<ReactRangeSliderInputRef>(null);

  useEffect(() => {     
    sliderRef.current!.thumb.lower.dataset.label = String(rangeValue[0]);  
    sliderRef.current!.thumb.upper.dataset.label = String(rangeValue[1]);  
  });
  
  const {min, max} = slider

  const rangeValue = [
    voices[i][`min${slider.value}` as NumericAttributeKey], 
    voices[i][`max${slider.value}` as NumericAttributeKey]
  ] as [number, number]
  
  const handleRangeInput = ([lo, hi]: [number, number]) => {    

    const updatedVoices = [...voices] as VoiceType[];   

    updatedVoices[i][`min${slider.value}` as NumericAttributeKey] = lo;    
    updatedVoices[i][`max${slider.value}` as NumericAttributeKey] = hi;    

    setVoices(updatedVoices);    
  };

  const props = {
    ref               : sliderRef,
    min               : min,  
    max               : max,    
    value             : rangeValue,  
    onInput           : handleRangeInput,
    'data-attribute'  : slider.attrName
  }
  
  return <RangeSlider {...props} />   
}