export const formatCurrency = (value: number, currency: string = 'UAH'): string => {
  if (typeof value !== 'number') {
    return '0'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value)
}