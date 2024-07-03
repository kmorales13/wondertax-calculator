import { taxBrackets } from "$lib/constants"

export function getEstimatedFederalTaxes(fillingStatus: FillingStatusType, income: number): number {
  const brackets = taxBrackets[fillingStatus]
  let totalTax = 0

  for (let idx = 0; idx < brackets.length; idx++) {
    const currBracket = brackets[idx]
    const prevBracket = brackets[idx - 1]

    if (income > currBracket.max) {
      totalTax += (currBracket.max - (prevBracket ? prevBracket.max : 0)) * currBracket.rate
    } else {
      totalTax += (income - (prevBracket ? prevBracket.max : 0)) * currBracket.rate
      break
    }
  }

  return totalTax
}

export function getEffectiveTaxRate(federal_taxes: number, taxable_income: number) {
  return ((federal_taxes / taxable_income) * 100 || 0).toFixed(1)
}
