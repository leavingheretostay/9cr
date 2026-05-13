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
                                <img src="https://i.postimg.cc/SR0gFn4v/images.jpg" alt="Love Her Wild" />
                        </div>
                        <div class="book-info">
                                <h3>Love Her Wild</h3>
                                <span class="author">Atticus</span>
                                <span class="tag">Poetry</span>
                        </div>
                </div>

                <div class="book">
                        <div class="book-cover">
                                <img src="https://i.postimg.cc/GtrvxGrN/71id-Mby-Wp-OL.jpg" alt="The Alchemist" />
                        </div>
                        <div class="book-info">
                                <h3>The Alchemist</h3>
                                <span class="author">Paulo Coelho</span>
                                <span class="tag">Fiction</span>
                        </div>
                </div>

                <div class="book">
                        <div class="book-cover">
                                <img src="https://i.postimg.cc/5ycsdXJK/you-are-the-best-wife.jpg" alt="You Are The Best Wife" />
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
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition: all 0.3s var(--bezier-one);
}

.book:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: var(--accent-opacity);
}

.book-cover {
        width: 48px;
        height: 68px;
        border-radius: 6px;
        background: var(--elevation-two);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.04);
}

.cover-icon {
        font-size: 1.2rem;
        opacity: 0.6;
}

.book-info {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
}

.book-info h3 {
        font-size: 1rem;
        margin: 0;
        color: var(--text-primary);
        font-weight: 500;
}

.book-info .author {
        font-size: 0.8rem;
        opacity: 0.55;
        color: var(--text-secondary);
}

.book-info .tag {
        font-size: 0.65rem;
        opacity: 0.35;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-top: 0.15rem;
        color: var(--text-secondary);
}

@media (max-width: 600px) {
        .book {
                padding: 1rem 1.15rem;
                gap: 1rem;
        }
        
        .book-cover {
                width: 42px;
                height: 60px;
        }
        
        .book-info h3 {
                font-size: 0.95rem;
        }
}
</style>