import { InputProps } from '../../types/input'

export default function Input(props: InputProps) {
  const label = props.label

  return (
    <>
      {
        label && <div className="label">
          {label}
        </div>
      }
      <div>
        <input 
          {...props}
        />
      </div>
    </>
  )
}