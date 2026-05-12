<script lang="ts">
	let activity = '@nacirlone';
	let details = 'Physics Postgraduate';
	let state = 'drawn toward atoms, silence & the unknown';

	let activityImage =
		'https://raw.githubusercontent.com/leavingheretostay/9cr/main/static/nasir.jpg';
</script>

<h2>activity</h2>

<div class="contain">
	<img src={activityImage} alt="Nasir Lone" class="big" />

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

	.big {
		height: 135px;
		width: 135px;
		border-radius: 20px;
		object-fit: cover;
		user-select: none;
		filter: grayscale(100%);
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
	}
</style>