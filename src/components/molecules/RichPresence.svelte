<script lang="ts">
	let activity = "@nacirlone";
	let details = "Offline";
	let activityImage = "default.webp";
	let state: string;

	function localTime() {
		state = new Date().toLocaleTimeString("en-IN", {
			timeZone: "Asia/Kolkata"
		});
	}

	localTime();
	setInterval(() => localTime(), 1000);
</script>

<h2>activity</h2>

<div class="contain">
	<img src={activityImage} alt={activity} class="big" />

	<div>
		<h3>{activity}</h3>
		<h5>{details}</h5>
		<h5>{state}</h5>
	</div>
</div>

<style lang="scss">
	.contain {
		display: flex;
		gap: 2.25rem;
		align-items: center;
	}

	h2 {
		display: none;
	}

	h3 {
		font-weight: 400;
		line-height: 1;
		margin: 0;
	}

	h5 {
		font-size: 1.8rem;
		font-weight: 400;
		line-height: 1.25;
		margin: 0;
	}

	.big {
		height: 135px;
		width: 135px;
		border-radius: 20px;
		user-select: none;
		transition: all 0.3s var(--bezier-one);
		object-fit: cover;
	}

	@media screen and (max-width: 868px) {
		h2 {
			display: block;
			margin-bottom: 1rem;
		}

		div {
			justify-content: left;
		}

		.big {
			height: 100px;
			width: 100px;
			border-radius: 17px;
		}

		h5 {
			font-size: 1.4rem;
		}
	}
</style>