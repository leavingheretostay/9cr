<h2>activity</h2>

<div class="contain">
	<img src="/default.webp" alt="Nasir" class="big" />

	<div class="text">
		<h3>@nacirlone</h3>
		<h5>Offline</h5>
		<h5>drawn toward atoms, silence & poetry</h5>
	</div>
</div>

<style lang="scss">
	h2 {
		display: none;
	}

	.contain {
		display: flex;
		gap: 2.25rem;
		align-items: center;
	}

	.text {
		display: flex;
		flex-direction: column;
	}

	h3 {
		font-size: 3rem;
		font-weight: 400;
		line-height: 1;
		margin: 0;
		color: var(--text-primary);
	}

	h5 {
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.4;
		margin: 0;
		color: var(--text-secondary);
	}

	.big {
		height: 135px;
		width: 135px;
		border-radius: 20px;
		object-fit: cover;
		user-select: none;
	}

	@media screen and (max-width: 868px) {
		h2 {
			display: block;
			margin-bottom: 1rem;
		}

		.contain {
			justify-content: left;
			gap: 1.5rem;
		}

		.big {
			height: 100px;
			width: 100px;
			border-radius: 17px;
		}

		h3 {
			font-size: 2.2rem;
		}

		h5 {
			font-size: 1.2rem;
		}
	}
</style>