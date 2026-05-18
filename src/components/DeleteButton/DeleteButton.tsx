import { DeleteButtonProps } from "./DeleteButton.types"

export default function DeleteButton ({...props}: DeleteButtonProps) {
  
  const {
    handleDelete,
    i
  } = props

  return <>
    <button 
      id="delete-voice"
      onClick={() => handleDelete(i)}
    >
      X
    </button>
  </>
}