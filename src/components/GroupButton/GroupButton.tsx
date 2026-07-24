import { Group }  from "../shared.types";
import Button     from "../Button/Button";

export default function GroupButton({

  group, 
  onToggle 

} : {  
  
  group     : Group
  onToggle  : (groupId: string) => void  

}) {  

  const handleClick = () => {  
    onToggle(group.id)  
  }  

  const props = {

    className : "group-button",  
    onClick   : handleClick
  }

  return <>  

    <Button
      props   = {props}
      label   = {group.label}
      imgPath = {group.id}
    />     
  </>  
}