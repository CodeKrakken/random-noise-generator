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
  setVoices,
  onToggle 

} : {  
  
  group     : Group
  voices    : VoiceType[]  
  i         : number  
  setVoices : React.Dispatch<React.SetStateAction<VoiceType[]>>  
  component : typeof ButtonGrid | typeof Piano
  onToggle  : (groupId: string) => void  

}) {  

  const handleClick = () => {  
    onToggle(group.id)  
  }  

  const props = {

    className : "group-button",  
    onClick   : handleClick
  }

  console.log(group)
  return <>  

    <Button
      props   = {props}
      label   = {group.label}
      imgPath = {group.id}
    />
      
      
  </>  
}