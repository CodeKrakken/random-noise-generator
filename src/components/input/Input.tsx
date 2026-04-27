import { InputProps } from '../../types/input'

export default function Input(props: InputProps) {
  const {
    title,
    label,
    className,
    id,
    type,
    value,
    onChange,
    maxLength,
    min,
    max,
    checked
  } = props

  const dataTestId = props['data-testid']

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
          title={title}
          id={id}
          data-testid={dataTestId}
          type={type} 
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          min={min}
          max={max}
          checked={checked}
        />
      </div>
    </>
  )
}