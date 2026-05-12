<h2>activity</h2>

<div class="contain">
	<img src="/nasir.jpg" alt="Nasir Lone" class="big" />

	<div class="info">
		<h3>@nacirlone</h3>
		<h5>Physics Postgraduate</h5>
		<h5>drawn toward atoms, silence & the unknown</h5>
	</div>
</div>

<style lang="scss">
	.contain {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		margin-top: 1rem;
		margin-bottom: 4rem;
	}

	.info {
		display: flex;
		flex-direction: column;
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
		margin: 0.2rem 0;
		line-height: 1.3;
		color: var(--text-secondary);
	}

	.big {
		height: 110px;
		width: 110px;
		border-radius: 18px;
		object-fit: cover;
		user-select: none;
	}

	@media screen and (max-width: 868px) {
		.contain {
			gap: 1rem;
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