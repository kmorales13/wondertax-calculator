<script lang="ts">
	import { additionalDeductions, standardDeductions } from '$lib/constants';
	import { formatCurrency } from '$lib/formatUtils';
	import { getEffectiveTaxRate, getEstimatedFederalTaxes } from '$lib/taxUtils';
	import CurrencyInput from '../components/CurrencyInput.svelte';
	import Header from '../components/Header.svelte';

	let status: FillingStatusType = 'single';
	let gross_income: number = 100000;
	let age: number;
	let contributions_401k: number;
	let contributions_ira: number;
	let withheld: number;

	$: retirementContributions = contributions_401k || contributions_ira || 0; // we assume IRA contributions are not tax-deductible if we are deducting 401k contributions
	$: standardDeduction =
		standardDeductions[status] + (age >= 65 ? additionalDeductions[status] : 0); // people older than 65 have additional standard deductions
	$: taxable_income = Math.max(0, gross_income - retirementContributions - standardDeduction);
	$: federal_taxes = getEstimatedFederalTaxes(status, taxable_income);
	$: tax_rate = getEffectiveTaxRate(federal_taxes, taxable_income);
	$: returnOrRefund = federal_taxes - (withheld || 0);
</script>

<main class="w-screen h-screen justify-center items-center bg-base-200">
	<Header />

	<div class="card bg-base-100 w-full max-w-96 shadow-xl m-auto">
		<div class="card-body">
			<table>
				<tbody>
					<tr>
						<td id="taxable-income-label">Taxable Income</td>
						<td class="font-semibold" aria-labelledby="taxable-income-label"
							>{formatCurrency(taxable_income)}</td
						>
					</tr>
					<tr>
						<td id="tax-rate-label">Effective tax rate</td>
						<td class="font-semibold" aria-labelledby="tax-rate-label">{tax_rate}%</td>
					</tr>
					<tr>
						<td id="federal-taxes-label">Estimated federal taxes</td>
						<td class="font-semibold" aria-labelledby="federal-taxes-label"
							>{formatCurrency(federal_taxes)}</td
						>
					</tr>
					<tr>
						<td id="withheld-label">Federal taxes withheld</td>
						<td class="font-semibold" aria-labelledby="withheld-label"
							>{formatCurrency(withheld)}</td
						>
					</tr>
					<div class="divider my-2" />
					<tr>
						<td class="text-lg" id="estimate-label"
							>We estimate you will {returnOrRefund > 0 ? 'owe' : 'get back'}</td
						>
						<td
							class={`text-lg font-semibold ${returnOrRefund > 0 ? 'text-red-400' : 'text-lime-400'}`}
							aria-labelledby="estimate-label">{formatCurrency(returnOrRefund)}</td
						>
					</tr>
				</tbody>
			</table>

			<div class="divider my-0" />

			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Tax filling status</span>
				</div>
				<select class="select select-bordered" bind:value={status} aria-label="Tax filling status">
					<option selected value="single">Single</option>
					<option value="marriedFilingJointly">Married, Filling Jointly</option>
					<option value="marriedFilingSeparately">Married, Filling Separately</option>
					<option value="headOfHousehold">Head of Household</option>
				</select>
			</label>

			<CurrencyInput label="Income" placeholder="$100,000" bind:value={gross_income} />

			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Age</span>
				</div>
				<input
					type="number"
					placeholder="35"
					class="input input-bordered w-full max-w-xs placeholder:text-gray-600"
					bind:value={age}
					aria-label="Age"
				/>
			</label>

			<CurrencyInput
				label="401(k) contributions"
				placeholder="$0"
				bind:value={contributions_401k}
			/>
			<CurrencyInput
				label="IRA contributions"
				placeholder="$0"
				bind:value={contributions_ira}
				disabled={!!contributions_401k}
			/>
			<CurrencyInput label="Withheld" placeholder="$0" bind:value={withheld} />
		</div>
	</div>
</main>
