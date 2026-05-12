<script lang="ts">
	let activity = "@nacirlone";
	let details = "Offline";
	let activityImage = "/default.webp";

	function getIndianTime() {
		return new Date().toLocaleTimeString("en-IN", {
			timeZone: "Asia/Kolkata",
			hour: "numeric",
			minute: "2-digit",
			second: "2-digit",
			hour12: true
		});
	}

	let state = getIndianTime();

	setInterval(() => {
		state = getIndianTime();
	}, 1000);
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
		display: block;
		margin-bottom: 1rem;
	}

	.contain {
		display: flex;
		align-items: center;
		gap: 2.25rem;
	}

	.info {
		display: flex;
		flex-direction: column;
	}

	h3 {
		font-size: 3rem;
		font-weight: 400;
		line-height: 1;
		margin: 0;
		font-family: var(--font-mono);
		color: var(--text-primary);
	}

	h5 {
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.35;
		margin: 0;
		font-family: var(--font-mono);
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
		.contain {
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