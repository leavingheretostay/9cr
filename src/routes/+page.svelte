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

	<section class="poems wrapper">
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
			<span>— Atticus</span>
		</div>

		<div class="quote">
			<p>
				“Love one another, but make not a bond of love: Let it rather be a moving sea between the shores of your souls.”
			</p>
			<span>— Khalil Gibran</span>
		</div>

		<div class="quote">
			<p>
				“Sometimes I am terrified  
				of my intense hunger to live,  
				because dying has always seemed  
				like the easier option.”
			</p>
			<span>— Christopher Poindexter</span>
		</div>

		<div class="quote">
			<p>
				“While I was scared to fall in love at a young age,
She whispered it in my ears,
"Why fear falling in love in childhood when we all become the child in love,"
Love turns us all into children and turns the dead alive.
She was so close to my chest that I could hear our hearts beating and her love breathing.
Her love felt so deep that I could just relate it to an ocean and made up my mind,
"even if I know how to swim I will prefer to drown in love".”
			</p>
			<span>— 9cr</span>
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