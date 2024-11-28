import { ProductTarifOption } from '@/energy/products/domain/ProductTarifOption'
import type { ProductTaxes } from '@/energy/products/domain/ProductTaxes'

type Price = {
  power: number
  base?: number
  hp?: number
  hc?: number
  hc2?: number
}

interface CalculatePriceEnergyProps {
  price: Price
  consumption: Price
  taxes: ProductTaxes
  monthDays: number
  tarifOption?: ProductTarifOption
}

export function calculatePriceEnergy({
  price,
  consumption,
  taxes,
  monthDays,
  tarifOption = ProductTarifOption.BASE,
}: CalculatePriceEnergyProps): number {
  const isThreePrice = tarifOption === ProductTarifOption.HPHC

  const consumptionBase = isThreePrice
    ? consumptionThreePrices(price, consumption)
    : consumptionOnePrice(consumption.base || 0, price.base || 0)

  const power = price.power * consumption.power * monthDays
  const consumptionTotal = consumptionBase + power

  const total = applyTaxes(consumptionTotal, taxes)

  return Number(total.toFixed(2))
}

function consumptionThreePrices(price: Price, consumption: Price): number {
  const priceHP = price.hp || 0
  const priceHC = price.hc || 0
  const priceHC2 = price.hc2 || 0

  const consumptionHP = consumption.hp || 0
  const consumptionHC = consumption.hc || 0
  const consumptionHC2 = consumption.hc2 || 0

  const hp = priceHP * consumptionHP
  const hc = priceHC * consumptionHC
  const hc2 = priceHC2 * consumptionHC2

  return hp + hc + hc2
}

function consumptionOnePrice(consumptionBase: number, priceBase: number): number {
  return consumptionBase * priceBase
}

function applyTaxes(consumption: number, taxes: ProductTaxes): number {
  const electricityTax = (consumption * taxes.tax) / 100
  const rentalMeter = taxes.rent
  const socialBonus = taxes.socialBonus
  const VAT = ((consumption + electricityTax + rentalMeter + socialBonus) * taxes.vat) / 100

  return consumption + electricityTax + rentalMeter + socialBonus + VAT
}
