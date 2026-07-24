import { useState }   from "react";
import { Group, VoiceType }      from "../shared.types";
import Button         from "../Button/Button";
import ButtonGrid     from "../ButtonGrid/ButtonGrid";
import Piano          from "../Piano/Piano";

export default function GroupButton({

  group, 
  component, 
  voices, 
  i, 
  setVoices 

} : {  
  
  group     : Group
  voices    : VoiceType[]  
  i         : number  
  setVoices : React.Dispatch<React.SetStateAction<VoiceType[]>>  
  component : typeof ButtonGrid | typeof Piano

}) {  

  const [hidden, setHidden] = useState(true)  
    
  const handleClick = () => {
    
    setHidden((prev) => !prev)
  }

  const props = {

    className : "group-button",  
    onClick   : handleClick
  }

  const ComponentToRender = component;  
  
  return <>  

    <Button
      props   = {props}
      label   = {group.label}
      imgPath = {group.id}
    />
      
    {
      !hidden && ComponentToRender ? (  

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
}