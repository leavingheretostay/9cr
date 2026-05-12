<script lang="ts">
	let activity = "@nacirlone";
	let details = "Offline";
	let state = "drawn toward atoms, silence & poetry";
	let activityImage = "/default.webp";

	const statuses = [
		"drawn toward atoms, silence & poetry",
		"probably reading poetry",
		"studying the universe",
		"lost somewhere in thought",
		"romanticizing existence"
	];

	let current = 0;

	setInterval(() => {
		current = (current + 1) % statuses.length;
		state = statuses[current];
	}, 4000);
</script>

<h2>activity</h2>

<div class="contain">
	<img src={activityImage} alt={activity} class="big" />

	<div class="info">
		<h3>{activity}</h3>
		<h5>{details}</h5>
		<h5>{state}</h5>
	</div>
</div>

<style lang="scss">
	h2 {
		display: none;
	}

	.contain {
		display: flex;
		align-items: center;
		gap: 2.25rem;
		margin-top: 1rem;
	}

	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h3 {
		font-size: 3.2rem;
		font-weight: 400;
		line-height: 1;
		margin: 0;
		color: var(--text-primary);
		font-family: var(--font-mono);
	}

	h5 {
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.35;
		margin: 0;
		color: var(--text-secondary);
		font-family: var(--font-mono);
	}

	.big {
		height: 135px;
		width: 135px;
		border-radius: 20px;
		object-fit: cover;
		user-select: none;
		transition: all 0.3s ease;
	}

	.big:hover {
		transform: scale(1.03);
	}

	@media screen and (max-width: 868px) {
		h2 {
			display: block;
			margin-bottom: 1rem;
		}

		.contain {
			gap: 1.5rem;
			align-items: center;
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
			line-height: 1.3;
		}
	}
</style>