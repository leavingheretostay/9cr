<script>
	import NavHost from '../components/molecules/NavHost.svelte';
	import Hero from '../components/organisms/Hero.svelte';
	import About from '../components/organisms/About.svelte';
	import Art from '../components/organisms/Art.svelte';
	import Projects from '../components/organisms/Projects.svelte';
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
	</div>

	<div class="quote">
		<p>
			“My atoms love your atoms,  
			it’s chemistry.”
		</p>
	</div>

	<div class="quote">
		<p>
			“Youth came over me like a mad storm.  
			I was helpless to the chemicals roaring in my brain.”
		</p>
	</div>

	<div class="quote">
		<p>
			“Poets spend their whole lives trying to think  
			of a better way to say,  
			‘He loved a girl.’”
		</p>
	</div>

	<div class="quote">
		<p>
			“Sometimes I am terrified  
			of my intense hunger to live,  
			because dying has always seemed  
			like the easier option.”
		</p>
	</div>
</section>
	<Art />
	<Repos />
	<Footer />
</main>
