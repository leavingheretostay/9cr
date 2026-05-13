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
                                "Love each other or perish."
                        </p>
                        <span>— Kurt Vonnegut</span>
                </div>

                <div class="quote">
                        <p>
                                "The finest souls are those who gulped pain and avoided making others taste it."
                        </p>
                        <span>— Nizariat</span>
                </div>

                <div class="quote">
                        <p>
                                "Obsession is the price I pay for my flaws."
                        </p>
                        <span>— 9cr</span>
                </div>

                <div class="quote">
                        <p>
                                "Love one another, but make not a bond of love: Let it rather be a moving sea between the shores of your souls."
                        </p>
                        <span>— Khalil Gibran</span>
                </div>

                <div class="quote">
                        <p>
                                "Sometimes I am terrified  
                                of my intense hunger to live,  
                                because dying has always seemed  
                                like the easier option."
                        </p>
                        <span>— Christopher Poindexter</span>
                </div>

                <div class="quote">
                        <p>
                                "Having experienced both, I am not sure which is worse; intense feeling, or the absence of it."
                        </p>
                        <span>— Margaret Atwood</span>
                </div>
        </section>

        <section id="books" class="books wrapper">
        <h2>bookshelf</h2>
        <p class="books-subtitle">A few favourites. Free downloads coming soon.</p>

        <div class="book-grid">
                <a href="https://www.amazon.com/s?k=Love+Her+Wild+Atticus" target="_blank" rel="noreferrer" class="book-link">
                        <div class="book">
                                <div class="book-cover">
                                        <img src="https://i.postimg.cc/GtrvxGrN/71id-Mby-Wp-OL.jpg" alt="Love Her Wild" />
                                </div>
                                <div class="book-info">
                                        <h3>Love Her Wild</h3>
                                        <span class="author">Atticus</span>
                                        <span class="tag">Poetry</span>
                                </div>
                        </div>
                </a>

                <a href="https://www.amazon.com/s?k=The+Alchemist+Paulo+Coelho" target="_blank" rel="noreferrer" class="book-link">
                        <div class="book">
                                <div class="book-cover">
                                        <img src="https://i.postimg.cc/SR0gFn4v/images.jpg" alt="The Alchemist" />
                                </div>
                                <div class="book-info">
                                        <h3>The Alchemist</h3>
                                        <span class="author">Paulo Coelho</span>
                                        <span class="tag">Fiction</span>
                                </div>
                        </div>
                </a>

                <a href="https://www.amazon.com/s?k=You+Are+The+Best+Wife+Ajay+K+Pandey" target="_blank" rel="noreferrer" class="book-link">
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
                </a>
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
                margin-bottom: 0.5rem;
        }

        .books-subtitle {
                font-size: 0.9rem;
                color: var(--text-secondary);
                opacity: 0.6;
                margin-top: 0;
                margin-bottom: 2rem;
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
                height: 70px;
                border-radius: 6px;
                background: var(--elevation-two);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .book-cover img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 6px;
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