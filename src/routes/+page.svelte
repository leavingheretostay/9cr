<script>
	import NavHost from '../components/molecules/NavHost.svelte';
	import Hero from '../components/organisms/Hero.svelte';
	import About from '../components/organisms/About.svelte';
	import Art from '../components/organisms/Art.svelte';
	import Repos from '../components/organisms/Repos.svelte';
	import Footer from '../components/organisms/Footer.svelte';
</script>

<NavHost />

<main>
	<Hero />
	<About />

	<section class="poems">
		<h2>fragments</h2>

		<div class="quote">
			<p>
				“Love each other or perish.”
			</p>
			<span>— Kurt Vonnegut</span>
		</div>

		<div class="quote">
			<p>
				“My atoms love your atoms,  
				it’s chemistry.”
			</p>
			<span>— Atticus</span>
		</div>

		<div class="quote">
			<p>
				“Youth came over me like a mad storm.  
				I was helpless to the chemicals roaring in my brain.”
			</p>
			<span>— Nayyirah Waheed</span>
		</div>

		<div class="quote">
			<p>
				“Poets spend their whole lives trying to think  
				of a better way to say,  
				‘He loved a girl.’”
			</p>
			<span>— Unknown</span>
		</div>

		<div class="quote">
			<p>
				“Sometimes I am terrified  
				of my intense hunger to live,  
				because dying has always seemed  
				like the easier option.”
			</p>
			<span>— Unknown</span>
		</div>

		<div class="quote">
			<p>
				“While I was scared to fall in love at a young age,  
				she whispered in my ears,  
				‘Why fear falling in love in childhood when  
				we all become the child in love.’”
			</p>
			<span>— Unknown</span>
		</div>
	</section>

	<Art />
	<Repos />
	<Footer />
</main>

<style lang="scss">
	.poems {
		margin-top: 5rem;
		width: 100%;
		max-width: 700px;
	}

	.poems h2 {
		font-size: 2rem;
		margin-bottom: 2.5rem;
	}

	.quote {
		padding: 1.8rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 18px;
		background: rgba(255,255,255,0.03);
		backdrop-filter: blur(8px);
	}

	.quote p {
		line-height: 2rem;
		font-size: 1rem;
		white-space: pre-line;
		margin-bottom: 1rem;
	}

	.quote span {
		opacity: 0.7;
		font-size: 0.9rem;
		font-style: italic;
	}
</style>