import { buttonImages } from "../../content/data"

export default function Button({

  props, 
  label,
  imgPath

}: {

  props     : any
  label     : string
  imgPath?  : string

}) {

  const imgSrc = buttonImages[imgPath!] || ""
  return <>  
    <button {...props}>  

      {
        imgSrc ? <img 
          alt="" 
          src={imgSrc} 
          width="100%" 
          height="100%" 
        /> : <>
          {label}
        </>
      }  
      
    </button>
  </>
}