import { VoiceProps } from '../../types/voice'
import DeleteButton from '../delete-button/DeleteButton'
import Inputs from '../inputs/Inputs'

export default function Voice(
  {
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