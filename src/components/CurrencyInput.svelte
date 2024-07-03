<script lang="ts">
	import { allowedKeys } from '$lib/constants';
	import { formatCurrency } from '$lib/formatUtils';

	export let label: string;
	export let placeholder: string;
	export let value: number;
	export let disabled: boolean = false;

	$: formattedValue = value === undefined ? '' : formatCurrency(value);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const cleanValue = target.value.replace(/[^0-9.]/g, '');
		value = parseFloat(cleanValue) || 0;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
			event.preventDefault();
		}
	}
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text">{label}</span>
	</div>
	<input
		type="text"
		{placeholder}
		class="input input-bordered w-full max-w-xs placeholder:text-gray-600"
		value={formattedValue}
		on:input={handleInput}
		on:keydown={handleKeyDown}
		{disabled}
		aria-label={label}
		aria-live="polite"
	/>
</label>
