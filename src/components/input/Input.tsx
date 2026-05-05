import { InputProps } from '../../types/input'

export default function Input(props: InputProps) {
  const {
    // title,
    label,
    className,
    // i,
    // id,
    type,
    value,
    onChange,
    dataRole,
    dataVoice,
    dataAttribute,
    // maxLength,
    // min,
    // max,
    checked
  } = props

  // const dataTestId = `voice-${title}-${i}`

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
          // title={title}
          // id={id}
          // data-testid={dataTestId}
          type={type} 
          value={value}
          onChange={onChange}
          // maxLength={maxLength}
          // min={min}
          // max={max}
          checked={checked}
          data-role={dataRole}
          data-voice={dataVoice}
          data-attribute={dataAttribute}
        />
      </div>
    </>
  )
}