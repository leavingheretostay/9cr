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
        let comments: { name: string; text: string }[][] = [[], [], [], [], [], []];
        let commentInputs: string[] = ['', '', '', '', '', ''];
        let commentNames: string[] = ['', '', '', '', '', ''];
        let activeSheet: number = -1;
        let longPressTimer: ReturnType<typeof setTimeout> | null = null;

        onMount(async () => {
                liked = [false, false, false, false, false, false];
                localStorage.removeItem('poem-liked');

                if (supabase) {
                        const { data: likeData, error: likeError } = await supabase
                                .from('poem_likes')
                                .select('*')
                                .order('poem_index');
                        if (!likeError && likeData) {
                                likeData.forEach((row: any) => {
                                        likes[row.poem_index] = row.like_count;
                                });
                        }

                        const { data: commentData, error: commentError } = await supabase
                                .from('poem_comments')
                                .select('*')
                                .order('created_at', { ascending: true });
                        if (!commentError && commentData) {
                                const newComments: { name: string; text: string }[][] = [[], [], [], [], [], []];
                                commentData.forEach((row: any) => {
                                        if (!newComments[row.poem_index]) newComments[row.poem_index] = [];
                                        newComments[row.poem_index].push({
                                                name: row.comment_name || 'Anonymous',
                                                text: row.comment_text
                                        });
                                });
                                comments = newComments;
                        }
                }
        });

        async function handleLike(index: number): Promise<void> {
                if (liked[index]) return;
                liked[index] = true;
                likes[index]++;
                localStorage.setItem('poem-liked', JSON.stringify(liked));

                if (supabase) {
                        await supabase
                                .from('poem_likes')
                                .upsert({ poem_index: index, like_count: likes[index] }, { onConflict: 'poem_index' });
                }
        }

        async function postComment(index: number): Promise<void> {
                const text = commentInputs[index].trim();
                const name = commentNames[index].trim() || 'Anonymous';
                if (!text || !supabase) return;

                const { error } = await supabase
                        .from('poem_comments')
                        .insert({ poem_index: index, comment_text: text, comment_name: name });

                if (!error) {
                        comments[index] = [...comments[index], { name, text }];
                        comments = comments;
                        commentInputs[index] = '';
                }
        }

        async function deleteComment(poemIndex: number, commentIndex: number): Promise<void> {
                if (!supabase) return;
                const comment = comments[poemIndex][commentIndex];

                const { error } = await supabase
                        .from('poem_comments')
                        .delete()
                        .eq('comment_text', comment.text)
                        .eq('comment_name', comment.name);

                if (!error) {
                        comments[poemIndex] = comments[poemIndex].filter((_, i) => i !== commentIndex);
                        comments = comments;
                }
        }

        function sharePoem(text: string, index: number): void {
                const url = 'https://9cr.pages.dev';
                const shareText = `"${text}"\n\n— via 9cr`;
                if (navigator.share) {
                        navigator.share({ title: '9cr - fragments', text: shareText, url });
                } else {
                        navigator.clipboard.writeText(`${shareText}\n${url}`);
                        alert('Copied to clipboard!');
                }
        }
</script>

<NavHost />

<main>
        <Hero />
        <About />

        <section id="music" class="music wrapper">
        <h2>music</h2>
        <div class="music-player" style="background-image: url('https://i.postimg.cc/tJ3DDYyt/3fbc804b902583553c7626f1926a23a9.jpg');">
                <div class="music-overlay">
                        <audio controls style="width:100%;">
                                <source src="https://files.catbox.moe/7ezaax.mp3" type="audio/mpeg">
                        </audio>
                </div>
        </div>
        <div class="music-label">
                <p class="song-title">Deedaar</p>
                <p class="song-artist">Third Hour</p>
        </div>
</section>

        <section id="fragments" class="poems wrapper">
                <h2>fragments</h2>

                <div class="quote">
                        <p>"Love each other or perish."</p>
                        <span class="quote-author">— Kurt Vonnegut</span>
                        <div class="quote-actions">
                                <button class="action-btn" class:liked={liked[0]} on:click={() => handleLike(0)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span>{likes[0]}</span>
                                </button>
                                <button class="action-btn" on:click={() => activeSheet = 0}>
                                        <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>{comments[0]?.length || 0}</span>
                                </button>
                                <button class="action-btn" on:click={() => sharePoem('Love each other or perish.', 0)}>
                                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"The finest souls are those who gulped pain and avoided making others taste it."</p>
                        <span class="quote-author">— Nizariat</span>
                        <div class="quote-actions">
                                <button class="action-btn" class:liked={liked[1]} on:click={() => handleLike(1)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span>{likes[1]}</span>
                                </button>
                                <button class="action-btn" on:click={() => activeSheet = 1}>
                                        <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>{comments[1]?.length || 0}</span>
                                </button>
                                <button class="action-btn" on:click={() => sharePoem('The finest souls are those who gulped pain and avoided making others taste it.', 1)}>
                                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Obsession is the price I pay for my flaws."</p>
                        <span class="quote-author">— 9cr</span>
                        <div class="quote-actions">
                                <button class="action-btn" class:liked={liked[2]} on:click={() => handleLike(2)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span>{likes[2]}</span>
                                </button>
                                <button class="action-btn" on:click={() => activeSheet = 2}>
                                        <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>{comments[2]?.length || 0}</span>
                                </button>
                                <button class="action-btn" on:click={() => sharePoem('Obsession is the price I pay for my flaws.', 2)}>
                                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Love one another, but make not a bond of love: Let it rather be a moving sea between the shores of your souls."</p>
                        <span class="quote-author">— Khalil Gibran</span>
                        <div class="quote-actions">
                                <button class="action-btn" class:liked={liked[3]} on:click={() => handleLike(3)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span>{likes[3]}</span>
                                </button>
                                <button class="action-btn" on:click={() => activeSheet = 3}>
                                        <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>{comments[3]?.length || 0}</span>
                                </button>
                                <button class="action-btn" on:click={() => sharePoem('Love one another, but make not a bond of love.', 3)}>
                                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Sometimes I am terrified of my intense hunger to live, because dying has always seemed like the easier option."</p>
                        <span class="quote-author">— Christopher Poindexter</span>
                        <div class="quote-actions">
                                <button class="action-btn" class:liked={liked[4]} on:click={() => handleLike(4)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span>{likes[4]}</span>
                                </button>
                                <button class="action-btn" on:click={() => activeSheet = 4}>
                                        <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>{comments[4]?.length || 0}</span>
                                </button>
                                <button class="action-btn" on:click={() => sharePoem('Sometimes I am terrified of my intense hunger to live...', 4)}>
                                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>

                <div class="quote">
                        <p>"Having experienced both, I am not sure which is worse; intense feeling, or the absence of it."</p>
                        <span class="quote-author">— Margaret Atwood</span>
                        <div class="quote-actions">
                                <button class="action-btn" class:liked={liked[5]} on:click={() => handleLike(5)}>
                                        <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        <span>{likes[5]}</span>
                                </button>
                                <button class="action-btn" on:click={() => activeSheet = 5}>
                                        <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        <span>{comments[5]?.length || 0}</span>
                                </button>
                                <button class="action-btn" on:click={() => sharePoem('Having experienced both, I am not sure which is worse...', 5)}>
                                        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>
        </section>

        <section id="books" class="books wrapper">
                <h2>bookshelf</h2>
                <p class="books-subtitle">A few favourites. Free downloads coming soon.</p>
                <div class="book-grid">
                        <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=Love+Her+Wild+Atticus', '_blank')} on:keydown={(e) => e.key === 'Enter' && window.open('https://www.amazon.com/s?k=Love+Her+Wild+Atticus', '_blank')} role="button" tabindex="0">
                                <div class="book-cover"><img src="https://i.postimg.cc/GtrvxGrN/71id-Mby-Wp-OL.jpg" alt="Love Her Wild" /></div>
                                <div class="book-info"><h3>Love Her Wild</h3><span class="author">Atticus</span><span class="tag">Poetry</span></div>
                        </div>
                        <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=The+Alchemist+Paulo+Coelho', '_blank')} on:keydown={(e) => e.key === 'Enter' && window.open('https://www.amazon.com/s?k=The+Alchemist+Paulo+Coelho', '_blank')} role="button" tabindex="0">
                                <div class="book-cover"><img src="https://i.postimg.cc/SR0gFn4v/images.jpg" alt="The Alchemist" /></div>
                                <div class="book-info"><h3>The Alchemist</h3><span class="author">Paulo Coelho</span><span class="tag">Fiction</span></div>
                        </div>
                        <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=You+Are+The+Best+Wife+Ajay+K+Pandey', '_blank')} on:keydown={(e) => e.key === 'Enter' && window.open('https://www.amazon.com/s?k=You+Are+The+Best+Wife+Ajay+K+Pandey', '_blank')} role="button" tabindex="0">
                                <div class="book-cover"><img src="https://i.postimg.cc/5ycsdXJK/you-are-the-best-wife.jpg" alt="You Are The Best Wife" /></div>
                                <div class="book-info"><h3>You Are The Best Wife</h3><span class="author">Ajay K. Pandey</span><span class="tag">Fiction</span></div>
                        </div>
                </div>
        </section>

        <Art />
        <Repos />
        <Footer />
</main>

{#if activeSheet >= 0}
        <div class="comments-overlay" on:click={() => activeSheet = -1}>
                <div class="comments-sheet" on:click|stopPropagation>
                        <div class="sheet-header">
                                <h3>Comments</h3>
                                <button class="action-btn" on:click={() => activeSheet = -1}>✕</button>
                        </div>
                        <div class="sheet-body">
                                {#if comments[activeSheet]?.length > 0}
                                        {#each comments[activeSheet] as comment, i}
                                                <div class="comment-bubble"
                                                        on:touchstart={() => {
                                                                longPressTimer = setTimeout(() => {
                                                                        if (confirm('Delete this comment?')) {
                                                                                deleteComment(activeSheet, i);
                                                                        }
                                                                }, 800);
                                                        }}
                                                        on:touchend={() => clearTimeout(longPressTimer)}
                                                        on:touchmove={() => clearTimeout(longPressTimer)}
                                                >
                                                        <span class="comment-name">{comment.name}</span>
                                                        <p class="comment-text">{comment.text}</p>
                                                </div>
                                        {/each}
                                {:else}
                                        <p class="no-comments">No comments yet. Be the first!</p>
                                {/if}
                        </div>
                        <div class="sheet-input">
                                <input type="text" bind:value={commentNames[activeSheet]} placeholder="Your name" maxlength="30" class="name-input" />
                                <input type="text" bind:value={commentInputs[activeSheet]} placeholder="Add a comment..." maxlength="200" />
                                <button class="send-btn" on:click={() => postComment(activeSheet)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2">
                                                <line x1="22" y1="2" x2="11" y2="13"/>
                                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                        </svg>
                                </button>
                        </div>
                </div>
        </div>
{/if}

<style lang="scss">
        .poems { margin-top: 5rem; width: 100%; max-width: 700px; }
        .poems h2 { font-size: 2rem; margin-bottom: 2.5rem; }
        .quote { padding: 1.8rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; background: rgba(255,255,255,0.03); backdrop-filter: blur(8px); }
        .quote p { line-height: 2rem; font-size: 1rem; white-space: pre-line; margin-bottom: 0.5rem; }
        .quote-author { display: block; opacity: 0.7; font-size: 0.9rem; font-style: italic; margin-bottom: 0.75rem; }
        .quote-actions { display: flex; gap: 1.5rem; align-items: center; }
        .action-btn { display: flex; align-items: center; gap: 0.35rem; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.25rem; font-size: 0.85rem; -webkit-tap-highlight-color: transparent; transition: color 0.2s; }
        .action-btn:hover { color: var(--text-primary); }
        .action-btn.liked { color: #ef4444; }
        .heart-icon, .comment-icon, .share-icon { width: 20px; height: 20px; }
        .heart-icon { fill: transparent; stroke: currentColor; stroke-width: 2; transition: all 0.3s ease; }
        .action-btn.liked .heart-icon { fill: #ef4444; stroke: #ef4444; animation: heartPop 0.4s ease; }
        .comment-icon, .share-icon { stroke: currentColor; }
        @keyframes heartPop { 0% { transform: scale(1); } 30% { transform: scale(1.35); } 60% { transform: scale(0.85); } 100% { transform: scale(1); } }

        .music { margin-top: 5rem; width: 100%; max-width: 700px; }
.music h2 { font-size: 2rem; margin-bottom: 2rem; }
.music-player { 
        border-radius: 16px; overflow: hidden; 
        background-size: cover; background-position: center;
        min-height: 180px; display: flex; align-items: flex-end;
}
.music-overlay { 
        background: linear-gradient(transparent, rgba(0,0,0,0.8)); 
        width: 100%; padding: 3rem 1rem 1rem 1rem;
}
.music-overlay audio { display: block; width: 100%; }
.music-label { display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding: 0 0.25rem; }
.song-title { font-size: 0.95rem; color: var(--text-primary); font-weight: 600; margin: 0; }
.song-artist { font-size: 0.85rem; color: var(--text-secondary); opacity: 0.7; margin: 0; }

        .comments-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: flex-end; }
        .comments-sheet { background: var(--bg-color); border-radius: 20px 20px 0 0; width: 100%; max-height: 60vh; display: flex; flex-direction: column; animation: slideUpSheet 0.3s ease; }
        @keyframes slideUpSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sheet-header h3 { margin: 0; font-size: 1rem; }
        .sheet-body { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; }
        .sheet-input { display: flex; gap: 0.4rem; padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.08); align-items: center; }
        .sheet-input input { flex: 1; min-width: 60px; padding: 0.55rem 0.75rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: var(--elevation-one); color: var(--text-primary); font-family: inherit; font-size: 0.8rem; }
        .sheet-input input:focus { outline: none; border-color: var(--accent); }
        .name-input { max-width: 100px; }
        .send-btn { background: var(--accent); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s; }
        .send-btn:hover { filter: brightness(1.15); transform: scale(1.05); }
        .comment-bubble { padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .comment-name { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 0.15rem; }
        .comment-text { font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.4; }
        .no-comments { font-size: 0.85rem; color: var(--text-secondary); opacity: 0.5; text-align: center; padding: 1rem 0; }

        .books { margin-top: 5rem; width: 100%; max-width: 700px; }
        .books h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .books-subtitle { font-size: 0.9rem; color: var(--text-secondary); opacity: 0.6; margin-top: 0; margin-bottom: 2rem; }
        .book-grid { display: flex; flex-direction: column; gap: 1rem; }
        .book { cursor: pointer; display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: rgba(255,255,255,0.02); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: all 0.3s var(--bezier-one); }
        .book:hover { background: rgba(255,255,255,0.04); border-color: var(--accent-opacity); }
        .book-cover { width: 48px; height: 70px; border-radius: 6px; background: var(--elevation-two); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.04); }
        .book-cover img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
        .book-info { display: flex; flex-direction: column; gap: 0.15rem; }
        .book-info h3 { font-size: 1rem; margin: 0; color: var(--text-primary); font-weight: 500; }
        .book-info .author { font-size: 0.8rem; opacity: 0.55; color: var(--text-secondary); }
        .book-info .tag { font-size: 0.65rem; opacity: 0.35; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0.15rem; color: var(--text-secondary); }
        @media (max-width: 600px) { .book { padding: 1rem 1.15rem; gap: 1rem; } .book-cover { width: 42px; height: 60px; } .book-info h3 { font-size: 0.95rem; } }
</style>