export default function DeleteButton ({...props}: any) {
  
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