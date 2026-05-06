import { InputProps } from '../../types/input'

export default function Input(props: InputProps) {
  const {
    label,
    className,
    type,
    value,
    onChange,
    dataVoice,
    dataAttribute,
    checked
  } = props

  return (
    <>
      {
        label && <div className="label">
          {label}
        </div>
      }
      <div>
        <input 
          className={className}
          type={type} 
          value={value}
          onChange={onChange}
          checked={checked}
          data-voice={dataVoice}
          data-attribute={dataAttribute}
        />
      </div>
    </>
  )
}