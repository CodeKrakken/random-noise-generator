import { VoiceProps, CheckboxGroup, Atom } from '../../types/voice'
import {checkboxGroups, extrema, fields} from '../../content/data'
import Input from '../input/Input'
import { updateField, updateCheckbox } from './functions'
import DeleteButton from '../delete-button/DeleteButton'
import Inputs from '../inputs/Inputs'

export default function Voice(
  {
    voice, 
    i, 
    voices,  
    handleDelete,
    setVoices,
    dataAttribute
  }: VoiceProps
) {
  
  return <div 
    className="voice" 
    id={`voice${i}`}
    data-testid={`voice-${i}`}
    key={`voice-${i}`}
    data-voice={i}
    data-attribute={dataAttribute}
  >
    <div className="row">
      <Inputs 
        i={i}
        voice={voice}
        voices={voices}
        setVoices={setVoices}
      />      
      <DeleteButton
        handleDelete={handleDelete}
        i={i}
      />
      
    </div>
  </div>
}