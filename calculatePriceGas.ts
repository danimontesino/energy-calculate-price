import type { ProductTaxes } from '@/energy/products/domain/ProductTaxes'

export interface CalculatePriceGasProps {
  variablePrice: number
  fixedPriceAnnual: number
  monthDays: number
  consumption: number
  taxes: ProductTaxes
}

export function calculatePriceGas({
  variablePrice,
  fixedPriceAnnual,
  monthDays,
  consumption,
  taxes,
}: CalculatePriceGasProps): number {
  const fixedPrice = (fixedPriceAnnual / 365) * monthDays
  const consumptionTotal = fixedPrice + variablePrice * consumption

  const total = applyTaxes(consumptionTotal, taxes)

  return Number(total.toFixed(2))
}

function applyTaxes(consumption: number, taxes: ProductTaxes): number {
  const taxHC = taxes.tax
  const rentalMeter = taxes.rent
  const socialBonus = taxes.socialBonus
  const VAT = ((consumption + taxHC + rentalMeter + socialBonus) * taxes.vat) / 100

  return consumption + taxHC + rentalMeter + socialBonus + VAT
}
