<script lang="ts">
        import { onMount } from 'svelte';
        import NavHost from '../components/molecules/NavHost.svelte';
        import Hero from '../components/organisms/Hero.svelte';
        import About from '../components/organisms/About.svelte';
        import Art from '../components/organisms/Art.svelte';
        import Repos from '../components/organisms/Repos.svelte';
        import Footer from '../components/organisms/Footer.svelte';
        import MusicPlayer from '../components/organisms/MusicPlayer.svelte';
        import Fragments from '../components/organisms/Fragments.svelte';
        import Bookshelf from '../components/organisms/Bookshelf.svelte';
        import CommentsSheet from '../components/organisms/CommentsSheet.svelte';
        import { supabase } from '../util/supabase';

        let likes: number[] = [0, 0, 0, 0, 0, 0];
        let liked: boolean[] = [false, false, false, false, false, false];
        let comments: { name: string; text: string }[][] = [[], [], [], [], [], []];
        let commentInputs: string[] = ['', '', '', '', '', ''];
        let commentNames: string[] = ['', '', '', '', '', ''];
        let activeSheet: number = -1;
        let longPressTimer: ReturnType<typeof setTimeout> | null = null;
        let showDeleteComment = false;
        let deleteCommentTarget: { poem: number; index: number } | null = null;
        let deleteCommentError = '';

        let audioEl: HTMLAudioElement;
        let playing = false; let progress = 0; let currentTime = '0:00'; let duration = '0:00';
        let songLikes = 0; let songLiked = false;
        let audioLoading = false;

        let showMuseum = false; let museumScene = 0;
        const museumScenes = [
                { icon: 'physics', subtitle: 'Physics', text: 'Drawn toward atoms and the mysteries they hold.' },
                { icon: 'silence', subtitle: 'Silence', text: 'Finding peace in the quiet spaces between thoughts.' },
                { icon: 'poetry', subtitle: 'Poetry', text: 'Words that breathe, verses that heal.' },
                { icon: 'code', subtitle: 'Code', text: 'Building tiny universes with logic and design.' },
                { icon: 'art', subtitle: 'Art', text: 'Painting silence into something you can see.' },
                { icon: 'everything', subtitle: 'Everything', text: 'Still learning, still wandering, still becoming.' }
        ];

        function togglePlay() {
                if (!audioEl) return;
                // If audio not loaded yet, show spinner and load
                if (audioEl.readyState < 2) {
                        audioLoading = true;
                        audioEl.load();
                        audioEl.play().then(() => {
                                playing = true;
                        }).catch(() => {
                                // will retry on next tap
                        });
                        return;
                }
                if (playing) {
                        audioEl.pause();
                } else {
                        audioEl.play();
                }
                playing = !playing;
        }
        function updateProgress() { if (!audioEl) return; progress = (audioEl.currentTime / audioEl.duration) * 100 || 0; currentTime = `${Math.floor(audioEl.currentTime/60)}:${Math.floor(audioEl.currentTime%60).toString().padStart(2,'0')}`; }
        function updateDuration() { if (!audioEl) return; duration = `${Math.floor(audioEl.duration/60)}:${Math.floor(audioEl.duration%60).toString().padStart(2,'0')}`; }
        function seek(e: MouseEvent | TouchEvent) { if (!audioEl) return; const bar = e.currentTarget as HTMLElement; const rect = bar.getBoundingClientRect(); audioEl.currentTime = (('touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX) - rect.left) / rect.width * audioEl.duration; }
        async function likeSong() { if (songLiked) return; songLiked = true; songLikes++; localStorage.setItem('song-liked','true'); if (supabase) await supabase.from('poem_likes').upsert({ poem_index: 99, like_count: songLikes }, { onConflict: 'poem_index' }); }

        function startAtomParticles() {
                setTimeout(() => {
                        const canvas = document.getElementById('atom-particles') as HTMLCanvasElement;
                        if (!canvas) return;
                        const ctx = canvas.getContext('2d')!;
                        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
                        const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
                        const equations = ['E=mc²', 'F=ma', 'λ=h/p', 'ΔxΔp≥ℏ/2', 'iℏ∂ψ/∂t=Ĥψ', 'S=k log W', '∇·E=ρ/ε₀', 'P+V=constant'];
                        for (let i = 0; i < 30; i++) {
                                particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, size: Math.random()*2+0.5 });
                        }
                        let eqIndex = 0; let eqX = canvas.width; let eqY = Math.random() * canvas.height * 0.6 + canvas.height * 0.2;
                        function anim() {
                                if (!document.getElementById('atom-particles')) return;
                                ctx.clearRect(0,0,canvas.width,canvas.height);
                                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                                particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>canvas.width)p.vx*=-1; if(p.y<0||p.y>canvas.height)p.vy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fillStyle=accent; ctx.globalAlpha=0.35; ctx.fill(); });
                                eqX -= 0.6;
                                ctx.globalAlpha = 0.25; ctx.fillStyle = accent; ctx.font = '14px "Geist Mono", monospace';
                                ctx.fillText(equations[eqIndex], eqX, eqY);
                                if (eqX < -150) { eqX = canvas.width + 50; eqY = Math.random() * canvas.height * 0.6 + canvas.height * 0.2; eqIndex = (eqIndex + 1) % equations.length; }
                                ctx.globalAlpha = 1;
                                requestAnimationFrame(anim);
                        }
                        anim();
                }, 100);
        }

        onMount(async () => {
                const savedLiked = localStorage.getItem('poem-liked'); if (savedLiked) try { liked = JSON.parse(savedLiked); } catch(e) {}
                if (localStorage.getItem('song-liked') === 'true') songLiked = true;
                if (supabase) {
                        const { data: ld } = await supabase.from('poem_likes').select('*').order('poem_index'); if (ld) ld.forEach((r: any) => { if (r.poem_index < 6) likes[r.poem_index] = r.like_count; if (r.poem_index === 99) songLikes = r.like_count; });
                        const { data: cd } = await supabase.from('poem_comments').select('*').order('created_at', { ascending: true }); if (cd) { const nc: { name: string; text: string }[][] = [[], [], [], [], [], []]; cd.forEach((r: any) => { if (!nc[r.poem_index]) nc[r.poem_index] = []; nc[r.poem_index].push({ name: r.comment_name || 'Anonymous', text: r.comment_text }); }); comments = nc; }
                }
        });

        async function handleLike(i: number) { if (liked[i]) return; liked[i] = true; likes[i]++; localStorage.setItem('poem-liked', JSON.stringify(liked)); if (supabase) await supabase.from('poem_likes').upsert({ poem_index: i, like_count: likes[i] }, { onConflict: 'poem_index' }); }
        async function postComment(i: number) { const t = commentInputs[i].trim(); const n = commentNames[i].trim() || 'Anonymous'; if (!t || !supabase) return; const { error } = await supabase.from('poem_comments').insert({ poem_index: i, comment_text: t, comment_name: n }); if (!error) { comments[i] = [...comments[i], { name: n, text: t }]; comments = comments; commentInputs[i] = ''; } }
        async function deleteComment(p: number, i: number) { if (!supabase) return; const c = comments[p][i]; await supabase.from('poem_comments').delete().eq('comment_text', c.text).eq('comment_name', c.name); comments[p] = comments[p].filter((_, j) => j !== i); comments = comments; }
        
        async function confirmDeleteComment(password: string) {
                if (password !== '9cr2026') {
                        deleteCommentError = 'Wrong password';
                        return;
                }
                if (deleteCommentTarget) {
                        await deleteComment(deleteCommentTarget.poem, deleteCommentTarget.index);
                        showDeleteComment = false;
                        deleteCommentError = '';
                }
        }
        function sharePoem(t: string) { const url = 'https://9cr.pages.dev'; const st = `"${t}"\n\n— via 9cr`; if (navigator.share) navigator.share({ title: '9cr - fragments', text: st, url }); else { navigator.clipboard.writeText(`${st}\n${url}`); alert('Copied!'); } }
        function nextMuseumScene() { museumScene < museumScenes.length - 1 ? museumScene++ : (showMuseum = false, museumScene = 0); }
        function openSheet(i: number) { activeSheet = i; }
        function closeSheet() { activeSheet = -1; }
        function startDeleteComment(p: number, i: number) { showDeleteComment = true; deleteCommentTarget = { poem: p, index: i }; }
</script>

<NavHost />
<main>
        <Hero on:cinematic={() => { showMuseum = true; museumScene = 0; startAtomParticles(); }} />
        <About />
        <MusicPlayer {playing} {progress} {currentTime} {duration} {songLikes} {songLiked} {togglePlay} {seek} {likeSong} {audioLoading} />
        <Fragments {likes} {liked} {comments} {commentInputs} {commentNames} {activeSheet} {longPressTimer} {showDeleteComment} {deleteCommentTarget} {deleteCommentError} {handleLike} {postComment} {confirmDeleteComment} sharePoem={sharePoem} setActiveSheet={openSheet} startDeleteComment={startDeleteComment} />
        <Bookshelf />
        <Art />
        <Repos />
        <Footer />
</main>

<audio bind:this={audioEl} src="/music/deedaar.mp3" on:timeupdate={updateProgress} on:loadedmetadata={updateDuration} on:ended={() => playing = false} on:canplay={() => audioLoading = false} preload="none"></audio>

{#if showMuseum}
        <div class="museum-overlay" on:click={nextMuseumScene}>
                <canvas id="atom-particles"></canvas>
                <div class="museum-scene" on:click|stopPropagation>
                        <div class="museum-icon">
                                {#if museumScenes[museumScene].icon === 'physics'}
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/><circle cx="5" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/></svg>
                                {:else if museumScenes[museumScene].icon === 'silence'}
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 10 10M12 6v4M12 14h.01"/></svg>
                                {:else if museumScenes[museumScene].icon === 'poetry'}
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                {:else if museumScenes[museumScene].icon === 'code'}
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                {:else if museumScenes[museumScene].icon === 'art'}
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                {:else}
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>
                                {/if}
                        </div>
                        <h2 class="museum-title">{museumScenes[museumScene].subtitle}</h2>
                        <p class="museum-text">{museumScenes[museumScene].text}</p>
                        <div class="museum-dots">
                                {#each museumScenes as _, i}
                                        <span class="m-dot" class:active={i === museumScene}></span>
                                {/each}
                        </div>
                        <p class="museum-hint">Tap anywhere to continue</p>
                </div>
        </div>
{/if}

<CommentsSheet {comments} {activeSheet} {commentNames} {commentInputs} {showDeleteComment} {deleteCommentTarget} {deleteCommentError} {longPressTimer} {postComment} {confirmDeleteComment} {closeSheet} startDelete={startDeleteComment} />

<style lang="scss">
        .museum-overlay { 
                position: fixed; inset: 0; z-index: 10000; 
                background: rgba(255,255,255,0.06); 
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                display: flex; align-items: center; justify-content: center; 
                animation: fadeIn 0.5s ease; cursor: pointer; 
        }
        #atom-particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .museum-scene { 
                position: relative; z-index: 1;
                text-align: center; padding: 2.5rem;
                background: rgba(0,0,0,0.3);
                border-radius: 24px;
                border: 1px solid rgba(255,255,255,0.25);
                box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
                animation: sceneIn 0.6s ease; 
                max-width: 420px; width: 90%;
        }
        .museum-icon { margin-bottom: 1.5rem; animation: float 3s ease infinite; }
        .museum-title { font-size: 1.8rem; color: var(--accent); margin-bottom: 0.75rem; font-weight: 600; }
        .museum-text { font-size: 1.1rem; color: #ffffff; margin: 0 auto 2rem auto; line-height: 1.8; opacity: 0.9; }
        .museum-dots { display: flex; gap: 0.6rem; justify-content: center; margin-bottom: 1.5rem; } 
        .m-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: all 0.3s; border: 1px solid rgba(255,255,255,0.2); } 
        .m-dot.active { background: var(--accent); width: 28px; border-radius: 6px; border-color: var(--accent); box-shadow: 0 0 12px var(--accent-opacity); }
        .museum-hint { font-size: 0.85rem; color: rgba(255,255,255,0.7); animation: pulse 2s ease infinite; margin-top: 0.5rem; font-weight: 500; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        @keyframes sceneIn { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } } 
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } } 
        @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
</style>
