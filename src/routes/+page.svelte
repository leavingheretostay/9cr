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

	<section id="fragments" class="poems wrapper">
		<h2>fragments</h2>

		<div class="quote">
			<p>
				“Love each other or perish.”
			</p>
			<span>— Kurt Vonnegut</span>
		</div>

		<div class="quote">
			<p>
				“The finest souls are those who gulped pain and avoided making others taste it.”
			</p>
			<span>— Nizariat</span>
		</div>

		<div class="quote">
			<p>
				“Obsession is the price I pay for my flaws.”
			</p>
			<span>— 9cr</span>
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

<section id="books" class="books wrapper">
        <h2>bookshelf</h2>

        <div class="book-grid">
                <div class="book">
                        <div class="book-cover">
                                <span class="cover-icon">📖</span>
                        </div>
                        <div class="book-info">
                                <h3>Love Her Wild</h3>
                                <span class="author">Atticus</span>
                                <span class="tag">Poetry</span>
                        </div>
                </div>

                <div class="book">
                        <div class="book-cover">
                                <span class="cover-icon">📖</span>
                        </div>
                        <div class="book-info">
                                <h3>The Alchemist</h3>
                                <span class="author">Paulo Coelho</span>
                                <span class="tag">Fiction</span>
                        </div>
                </div>

                <div class="book">
                        <div class="book-cover">
                                <span class="cover-icon">📖</span>
                        </div>
                        <div class="book-info">
                                <h3>You Are The Best Wife</h3>
                                <span class="author">Ajay K. Pandey</span>
                                <span class="tag">Fiction</span>
                        </div>
                </div>
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

.books {
        margin-top: 5rem;
        width: 100%;
        max-width: 700px;
}

.books h2 {
        font-size: 2rem;
        margin-bottom: 2.5rem;
}

.book-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
}

.book {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        padding: 1.25rem 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(8px);
        transition: all 0.3s var(--bezier-one);
}

.book:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--accent-opacity);
        transform: translateY(-2px);
}

.book-cover {
        width: 56px;
        height: 80px;
        border-radius: 8px;
        background: var(--elevation-one);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.06);
}

.cover-icon {
        font-size: 1.5rem;
}

.book-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
}

.book-info h3 {
        font-size: 1.1rem;
        margin: 0;
        color: var(--text-primary);
}

.book-info .author {
        font-size: 0.85rem;
        opacity: 0.7;
}

.book-info .tag {
        font-size: 0.7rem;
        opacity: 0.45;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 0.25rem;
}
</style>