<script lang="ts">
	let zoom: boolean;
	let xRotation: number;
	let yRotation: number;

	function enterRotate3D(e: MouseEvent) {
		zoom = true;
		let img = e.target as HTMLDivElement;
		yRotation = 13 * ((e.offsetX - img.clientHeight / 2) / img.clientWidth);
		xRotation = -13 * ((e.offsetY - img.clientWidth / 2) / img.clientHeight);
	}

	function leaveRotate3D() {
		zoom = false;
		yRotation = 0;
		xRotation = 0;
	}
</script>

<div class="img-container">
	<div
		on:mousemove={enterRotate3D}
		on:mouseleave={leaveRotate3D}
		class="img"
		role="img"
		style:background-image="url(art/afn.webp)"
		style:transform="perspective(500px) {zoom ? 'scale(1.05)' : ''} rotateX({xRotation}deg) rotateY({yRotation}deg)"
	/>
</div>

<style lang="scss">
	@keyframes float {
		0% {
			transform: translateY(7px);
		}
		50% {
			transform: translateY(-7px);
		}
		100% {
			transform: translateY(7px);
		}
	}

	.img {
		border-radius: 28px;
		width: 425px;
		height: 400px;
		border: 1px solid var(--elevation-four);
		box-shadow: 0 28px 70px -32px rgba(0, 0, 0, 0.38), 0 0 0 8px var(--elevation-one);
		background-position: center;
		will-change: transform;
		z-index: 1;
		display: block;
		transition:
			width 0.4s var(--bezier-one),
			transform 0.4s var(--bezier-one);
		align-self: start;
		background-color: var(--elevation-one);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		@media (max-width: 1240px) {
			width: clamp(280px, 36vw, 390px);
			height: clamp(300px, 38vw, 380px);
		}

		@media (max-width: 768px) {
			width: min(100%, 360px);
			height: clamp(220px, 68vw, 300px);
			margin: 2.25rem auto 0;
			border-radius: 22px;
		}

		@media (max-width: 500px) {
			width: min(100%, 320px);
			height: clamp(210px, 62vw, 270px);
		}
	}

	.img-container {
		z-index: 1;
		flex: 0 1 425px;
		min-width: 0;
		animation: float 6s ease-in-out infinite;
		animation-play-state: running;

		@media (max-width: 1240px) {
			display: flex;
			justify-content: center;
		}

		@media (max-width: 768px) {
			width: 100%;
			animation: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.img-container { animation: none; }
		.img { transition: none; }
	}
</style>
