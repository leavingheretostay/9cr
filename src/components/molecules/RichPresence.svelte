<style lang="scss">
	.contain {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		margin-top: 1rem;
		margin-bottom: 4rem;
	}

	h2 {
		display: block;
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	h3 {
		font-size: 2.2rem;
		margin: 0;
		line-height: 1.1;
	}

	h5 {
		font-size: 1.2rem;
		font-weight: 400;
		margin: 0.15rem 0;
		line-height: 1.3;
		color: var(--text-secondary);
	}

	a,
	a:not(:hover) {
		border-radius: 4px;
		text-decoration: underline;
		text-decoration-color: var(--bg-color);
		transition: 0.3s var(--bezier-one);
	}

	a:hover {
		text-decoration-color: var(--text-primary);
	}

	.big {
		height: 110px;
		width: 110px;
		border-radius: 18px;
		user-select: none;
		object-fit: cover;
	}

	.small {
		height: 34px;
		width: 34px;
		border-radius: 50%;
		position: absolute;
		transform: translate(220%, 140%);
		outline: 5px solid var(--bg-color);
		background-color: var(--bg-color);
	}

	progress {
		-webkit-appearance: none;
		appearance: none;
		border: 0;
		border-radius: 10rem;
		margin-top: 0.5rem;
		background-color: var(--elevation-one);
		height: 0.45rem;
		overflow: hidden;
		width: 100%;
	}

	progress::-webkit-progress-bar {
		background-color: var(--elevation-one);
		border-radius: 10rem;
	}

	progress::-webkit-progress-value {
		background-color: var(--accent);
		border-radius: 10rem;
	}

	progress::-moz-progress-bar {
		background-color: var(--accent);
		border-radius: 10rem;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.spin {
		animation: rotate 40s linear infinite;
		border-radius: 50%;
	}

	@media screen and (max-width: 868px) {
		.contain {
			gap: 1rem;
			align-items: center;
		}

		.big {
			height: 95px;
			width: 95px;
			border-radius: 16px;
		}

		h3 {
			font-size: 1.8rem;
		}

		h5 {
			font-size: 1rem;
		}
	}
</style>