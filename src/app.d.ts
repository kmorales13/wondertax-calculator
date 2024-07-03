// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type FillingStatusType = "single" | "marriedFilingJointly" | "marriedFilingSeparately" | "headOfHousehold"
	type TaxBracketType = {
		min: number
		max: number
		rate: number
	}
	type TaxBracketsType = {
		[status in FillingStatusType]: TaxBracketType[]
	}
}

export { };
