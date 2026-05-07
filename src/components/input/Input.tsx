import { InputProps } from '../../types/input'

export default function Input(props: InputProps) {
  const label = props.label

  return (
    <input 
      {...props}
    />  
  )
}