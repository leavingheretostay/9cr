<script>
	import Tooltip from './Tooltip.svelte';

	export let link = '';
	export let tip = '';
</script>

<Tooltip {tip}>
	<div>
		<a href={link} target="_blank" rel="noreferrer" aria-label={tip}>
			<slot/>
		</a>
	</div>
</Tooltip>

<style lang="scss">
	a {
		transition: all 0.3s var(--bezier-one);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
		background-color: transparent;
		border: none;
		border-radius: 10px;
		cursor: pointer;
	}

	div {
		transition: all 0.3s var(--bezier-one);

		&:hover {
			a {
				background-color: var(--elevation-one);
			}
		}

		&:active {
			transform: scale(98%);
		}

		&:focus-visible {
			outline: 2px solid var(--accent);
			outline-offset: 4px;
		}
	}
</style>
