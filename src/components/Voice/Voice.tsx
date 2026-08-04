import { VoiceType, Slider, Group } from '../shared.types'
import TextField                    from '../TextField/TextField'
import { buttonGroups, sliders }    from '../../content/data'
import DoubleSlider                 from '../DoubleSlider/DoubleSlider'
import SingleSlider                 from '../SingleSlider/SingleSlider'
import Button                       from '../Button/Button'
import { useState }                 from 'react'

export default function Voice({

    i, 
    voices,  
    handleDelete,
    setVoices,
    dataAttribute

  } : {

    i             : number, 
    setVoices     : React.Dispatch<React.SetStateAction<VoiceType[]>>, 
    voices        : VoiceType[], 
    handleDelete  : Function
    dataAttribute : string

  }) {

  const [hiddenStates, setHiddenStates] = useState<Record<string, boolean>>({  
    piano     : true,  
    octaves   : true,  
    intervals : true,  
    sounds    : true  
  })

  const deleteButtonProps = {
    props: { onClick: () => handleDelete(i) },
    label: "X"
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {  
    const value = e.currentTarget.value
    setHiddenStates(prev => ({ ...prev, [value]: !prev[value] }))  
  }

  // const sliderRows = Array.from(new Set(sliders.map(slider => slider.row)))
  
  return (
    <div 
      id="voice"
      data-voice={i}
      data-attribute={dataAttribute}
    >

      <div className="justified row">

        <TextField 
          attrName  = {'label'}
          i         = {i}
          voices    = {voices}
          setVoices = {setVoices}
        />

        <Button {...deleteButtonProps} />
        
      </div>       
        
      <div id="sliders">
        <div className="column">
          {
            sliders.map((slider: Slider) => {
              
              const Component = slider.className === 'single' ? SingleSlider : DoubleSlider

              return (

                <div key={slider.attrName} className="row">
                  <div className="slider-label">{slider.label}</div>
                  <div className={`${slider.className} slider`}>
                    <Component 
                      slider={slider}
                      i={i}
                      voices={voices}
                      setVoices={setVoices}
                    />
                  </div>
                </div>
              )}
            )
          }
        </div>
      </div>

      <div className="centred row">
        {
          buttonGroups.map(group => {

            const ComponentToRender = group.component;  
                        
            const props = {
              className : "group-button",  
              onClick   : handleClick,
              value     : group.id
            }

            return <>

              <Button
                props   = {props}
                label   = {group.label}
                imgPath = {group.id}
              />

              {
                !hiddenStates[group.id] && ComponentToRender ? (  
                  
                  <ComponentToRender   
                    group     = {group as Group}  
                    voices    = {voices}  
                    i         = {i}  
                    setVoices = {setVoices}  
                  />  
                ) 
                  : 
                <></>
              }
            </>
          })
        }
      </div>
    </div>
  )
}