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

interface MultiSelectFieldProps {
  label: string
  value: string[]
  options: ReadonlyArray<SelectOption>
  className?: string
  onValueChange: (next: string[]) => void
}

export function MultiSelectField({
  label,
  value,
  options,
  className,
  onValueChange,
}: MultiSelectFieldProps) {
  const handleValueChange = (v: string[]) => {
    const next = v ?? []
    const valueHasAll = value.includes('all')
    const nextHasAll = next.includes('all')

    // User is explicitly toggling "all"
    if (nextHasAll !== valueHasAll) {
      if (nextHasAll) {
        // User just selected "all" - deselect everything else
        onValueChange(['all'])
      } else {
        // User just deselected "all" - keep other selections or default to "all"
        onValueChange(next.length > 0 ? next : ['all'])
      }
    } else if (valueHasAll && nextHasAll) {
      // "all" is still in both - user clicked on specific items while "all" was selected
      // Deselect "all" and keep only the specific items
      const otherItems = next.filter(item => item !== 'all')
      if (otherItems.length > 0) {
        onValueChange(otherItems)
      } else {
        // Only "all" remains, keep it
        onValueChange(['all'])
      }
    } else {
      // Neither has "all" - just update with selected items, or default to "all" if empty
      onValueChange(next.length > 0 ? next : ['all'])
    }
  }

  return (
    <Field.Root
      className={`${styles.field}${className ? ` ${className}` : ''}`}
    >
      <Field.Label className={styles.label}>{label}</Field.Label>
      <Select.Root multiple value={value} onValueChange={handleValueChange}>
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
