import { Button, Field, Input, Select } from '@base-ui/react'
import type { ComponentChildren } from 'preact'
import styles from './form-controls.module.css'

export type SelectOption = {
  value: string
  label: string
}

interface TextFieldProps {
  label: string
  value: string
  placeholder?: string
  list?: string
  error?: string | null
  className?: string
  onValueChange: (next: string) => void
}

export function TextField({
  label,
  value,
  placeholder,
  list,
  error,
  className,
  onValueChange,
}: TextFieldProps) {
  return (
    <Field.Root
      className={`${styles.field}${className ? ` ${className}` : ''}`}
    >
      <Field.Label className={styles.label}>{label}</Field.Label>
      <Input
        className={styles.input}
        placeholder={placeholder}
        list={list}
        value={value}
        onChange={e => onValueChange((e.target as HTMLInputElement).value)}
      />
      {error && <Field.Error className={styles.error}>{error}</Field.Error>}
    </Field.Root>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  defaultValue: string
  options: ReadonlyArray<SelectOption>
  className?: string
  onValueChange: (next: string) => void
}

export function SelectField({
  label,
  value,
  defaultValue,
  options,
  className,
  onValueChange,
}: SelectFieldProps) {
  return (
    <Field.Root
      className={`${styles.field}${className ? ` ${className}` : ''}`}
    >
      <Field.Label className={styles.label}>{label}</Field.Label>
      <Select.Root
        value={value}
        onValueChange={v => onValueChange(v ?? defaultValue)}
      >
        <Select.Trigger className={styles.selectTrigger}>
          <Select.Value />
          <Select.Icon className={styles.selectIcon} aria-hidden="true">
            ▾
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={styles.selectPositioner}>
            <Select.Popup className={styles.selectPopup}>
              {options.map(opt => (
                <Select.Item
                  key={opt.value}
                  className={styles.selectItem}
                  value={opt.value}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  )
}

interface PrimaryButtonProps {
  children: ComponentChildren
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function PrimaryButton({
  children,
  type = 'button',
  className,
}: PrimaryButtonProps) {
  return (
    <Button
      className={`${styles.button}${className ? ` ${className}` : ''}`}
      type={type}
    >
      {children}
    </Button>
  )
}
