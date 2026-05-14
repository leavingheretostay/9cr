<script lang="ts">
        import { onMount } from 'svelte';
        import NavHost from '../components/molecules/NavHost.svelte';
        import Hero from '../components/organisms/Hero.svelte';
        import About from '../components/organisms/About.svelte';
        import Art from '../components/organisms/Art.svelte';
        import Repos from '../components/organisms/Repos.svelte';
        import Footer from '../components/organisms/Footer.svelte';
        import { supabase } from '../util/supabase';

        let likes: number[] = [0, 0, 0, 0, 0, 0];
        let liked: boolean[] = [false, false, false, false, false, false];

        onMount(async () => {
                const savedLiked = localStorage.getItem('poem-liked');
                if (savedLiked) {
                        try { liked = JSON.parse(savedLiked); } catch (e) {}
                }

                if (supabase) {
                        const { data, error } = await supabase
                                .from('poem_likes')
                                .select('*')
                                .order('poem_index');
                        if (!error && data) {
                                data.forEach((row: any) => {
                                        likes[row.poem_index] = row.like_count;
                                });
                        }
                }
        });

        async function handleLike(index: number): Promise<void> {
                if (liked[index]) return;
                liked[index] = true;
                likes[index]++;
                localStorage.setItem('poem-liked', JSON.stringify(liked));

                if (supabase) {
                        const { error } = await supabase
                                .from('poem_likes')
                                .upsert({ poem_index: index, like_count: likes[index] }, { onConflict: 'poem_index' });

                        if (error) {
                                console.error('Like error:', error.message);
                        }
                }
        }
</script>

<NavHost />

<main>
        <Hero />
        <About />

        <section id="fragments" class="poems wrapper">
                <h2>fragments</h2>

                <div class="quote">
                        <p>"Love each other or perish."</p>
                        <div class="quote-footer">
                                <span>— Kurt Vonnegut</span>
                                <button class="like-btn" class:liked={liked[0]} on:click={() => handleLike(0)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {likes[0]}
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"The finest souls are those who gulped pain and avoided making others taste it."</p>
                        <div class="quote-footer">
                                <span>— Nizariat</span>
                                <button class="like-btn" class:liked={liked[1]} on:click={() => handleLike(1)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {likes[1]}
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Obsession is the price I pay for my flaws."</p>
                        <div class="quote-footer">
                                <span>— 9cr</span>
                                <button class="like-btn" class:liked={liked[2]} on:click={() => handleLike(2)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {likes[2]}
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Love one another, but make not a bond of love: Let it rather be a moving sea between the shores of your souls."</p>
                        <div class="quote-footer">
                                <span>— Khalil Gibran</span>
                                <button class="like-btn" class:liked={liked[3]} on:click={() => handleLike(3)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {likes[3]}
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Sometimes I am terrified of my intense hunger to live, because dying has always seemed like the easier option."</p>
                        <div class="quote-footer">
                                <span>— Christopher Poindexter</span>
                                <button class="like-btn" class:liked={liked[4]} on:click={() => handleLike(4)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {likes[4]}
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Having experienced both, I am not sure which is worse; intense feeling, or the absence of it."</p>
                        <div class="quote-footer">
                                <span>— Margaret Atwood</span>
                                <button class="like-btn" class:liked={liked[5]} on:click={() => handleLike(5)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        {likes[5]}
                                </button>
                        </div>
                </div>
        </section>

        <section id="books" class="books wrapper">
                <h2>bookshelf</h2>
                <p class="books-subtitle">A few favourites. Free downloads coming soon.</p>

                <div class="book-grid">
                        <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=Love+Her+Wild+Atticus', '_blank')} on:keydown={(e) => e.key === 'Enter' && window.open('https://www.amazon.com/s?k=Love+Her+Wild+Atticus', '_blank')} role="button" tabindex="0">
                                <div class="book-cover">
                                        <img src="https://i.postimg.cc/GtrvxGrN/71id-Mby-Wp-OL.jpg" alt="Love Her Wild" />
                                </div>
                                <div class="book-info">
                                        <h3>Love Her Wild</h3>
                                        <span class="author">Atticus</span>
                                        <span class="tag">Poetry</span>
                                </div>
                        </div>

                        <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=The+Alchemist+Paulo+Coelho', '_blank')} on:keydown={(e) => e.key === 'Enter' && window.open('https://www.amazon.com/s?k=The+Alchemist+Paulo+Coelho', '_blank')} role="button" tabindex="0">
                                <div class="book-cover">
                                        <img src="https://i.postimg.cc/SR0gFn4v/images.jpg" alt="The Alchemist" />
                                </div>
                                <div class="book-info">
                                        <h3>The Alchemist</h3>
                                        <span class="author">Paulo Coelho</span>
                                        <span class="tag">Fiction</span>
                                </div>
                        </div>

                        <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=You+Are+The+Best+Wife+Ajay+K+Pandey', '_blank')} on:keydown={(e) => e.key === 'Enter' && window.open('https://www.amazon.com/s?k=You+Are+The+Best+Wife+Ajay+K+Pandey', '_blank')} role="button" tabindex="0">
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
                margin-bottom: 0.5rem;
        }

        .quote-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 0.75rem;
        }

        .quote span {
                opacity: 0.7;
                font-size: 0.9rem;
                font-style: italic;
        }

        .like-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.4rem;
                color: var(--text-secondary);
                font-size: 0.85rem;
                -webkit-tap-highlight-color: transparent;
                user-select: none;
                transition: color 0.2s;
        }

        .like-btn.liked {
                color: #ef4444;
        }

        .heart-icon {
                width: 22px;
                height: 22px;
                fill: transparent;
                stroke: currentColor;
                stroke-width: 2;
                transition: all 0.3s ease;
        }

        .like-btn.liked .heart-icon {
                fill: #ef4444;
                stroke: #ef4444;
                animation: heartPop 0.4s ease;
        }

        @keyframes heartPop {
                0% { transform: scale(1); }
                30% { transform: scale(1.35); }
                60% { transform: scale(0.85); }
                100% { transform: scale(1); }
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
                cursor: pointer;
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