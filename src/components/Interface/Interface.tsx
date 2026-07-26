import { MouseEventHandler }  from 'react';
import Voice                            from '../Voice/Voice';
import { VoiceType }                    from '../shared.types'
import Header                           from '../Header/Header';


function Interface({
  running,
  stopAll,
  start,
  handleAddVoice,
  voices,
  loadVoices,
  setVoices,
  handleDelete
} : {
  running         : Boolean
  stopAll         : Function
  start           : Function
  handleAddVoice  : React.MouseEventHandler<HTMLButtonElement>
  voices          : VoiceType[]
  loadVoices      : MouseEventHandler<HTMLButtonElement>
  setVoices       : React.Dispatch<React.SetStateAction<VoiceType[]>>, 
  handleDelete    : Function
}) {

  const handleStartStop = () => running ? stopAll() : start()

  return <>
    <Header 
      handleStartStop   = {handleStartStop}
      running           = {running}
      handleAddVoice    = {handleAddVoice}
      voices            = {voices}
      loadVoices        = {loadVoices}
    />
    
    <div 
      className="row section" 
      id="voices"
    >
      {
        voices.map((voice, i) => 

          <Voice
            i             = {i} 
            setVoices     = {setVoices} 
            voices        = {voices}
            handleDelete  = {handleDelete}
            dataAttribute = "Voices"
            key           = {voice.id}
          />
        )
      }
    </div>
  </>
}

export default Interface;
