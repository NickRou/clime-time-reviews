import { Button } from './ui/button'

interface PriceRangeSelectProps {
  value: number
  onChange: (value: number) => void
}

export function PriceRangeSelect({ value, onChange }: PriceRangeSelectProps) {
  const prices = [
    { label: '$', value: 1 },
    { label: '$$', value: 2 },
    { label: '$$$', value: 3 },
    { label: '$$$$', value: 4 },
  ]

  return (
    <div className="flex gap-2">
      {prices.map((price) => (
        <Button
          key={price.value}
          type="button"
          variant={value === price.value ? 'default' : 'outline'}
          onClick={() => onChange(price.value)}
          className="w-12"
        >
          {price.label}
        </Button>
      ))}
    </div>
  )
}
