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
        let deleteCommentPassword = '';
        let deleteCommentError = '';

        let audioEl: HTMLAudioElement;
        let playing = false; let progress = 0; let currentTime = '0:00'; let duration = '0:00';
        let songLikes = 0; let songLiked = false;

        let showMuseum = false; let museumScene = 0;
        const museumScenes = [
                { title: '⚛️', subtitle: 'Physics', text: 'Drawn toward atoms and the mysteries they hold.' },
                { title: '🔇', subtitle: 'Silence', text: 'Finding peace in the quiet spaces between thoughts.' },
                { title: '✍️', subtitle: 'Poetry', text: 'Words that breathe, verses that heal.' },
                { title: '💻', subtitle: 'Code', text: 'Building tiny universes with logic and design.' },
                { title: '🎨', subtitle: 'Art', text: 'Creating beauty from chaos, one stroke at a time.' },
                { title: '🌌', subtitle: 'Everything', text: 'Still learning, still wandering, still becoming.' }
        ];

        function togglePlay() { if (!audioEl) return; playing ? audioEl.pause() : audioEl.play(); playing = !playing; }
        function updateProgress() { if (!audioEl) return; progress = (audioEl.currentTime / audioEl.duration) * 100 || 0; currentTime = `${Math.floor(audioEl.currentTime/60)}:${Math.floor(audioEl.currentTime%60).toString().padStart(2,'0')}`; }
        function updateDuration() { if (!audioEl) return; duration = `${Math.floor(audioEl.duration/60)}:${Math.floor(audioEl.duration%60).toString().padStart(2,'0')}`; }
        function seek(e: MouseEvent | TouchEvent) { if (!audioEl) return; const bar = e.currentTarget as HTMLElement; const rect = bar.getBoundingClientRect(); audioEl.currentTime = (('touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX) - rect.left) / rect.width * audioEl.duration; }
        async function likeSong() { if (songLiked) return; songLiked = true; songLikes++; localStorage.setItem('song-liked','true'); if (supabase) await supabase.from('poem_likes').upsert({ poem_index: 99, like_count: songLikes }, { onConflict: 'poem_index' }); }

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
        async function confirmDeleteComment() { if (deleteCommentPassword !== '9cr2026') { deleteCommentError = 'Wrong password'; return; } if (deleteCommentTarget) { await deleteComment(deleteCommentTarget.poem, deleteCommentTarget.index); showDeleteComment = false; deleteCommentPassword = ''; deleteCommentError = ''; } }
        function sharePoem(t: string) { const url = 'https://9cr.pages.dev'; const st = `"${t}"\n\n— via 9cr`; if (navigator.share) navigator.share({ title: '9cr - fragments', text: st, url }); else { navigator.clipboard.writeText(`${st}\n${url}`); alert('Copied!'); } }
        function nextMuseumScene() { museumScene < museumScenes.length - 1 ? museumScene++ : (showMuseum = false, museumScene = 0); }
        function openSheet(i: number) { activeSheet = i; }
        function closeSheet() { activeSheet = -1; }
        function startDeleteComment(p: number, i: number) { showDeleteComment = true; deleteCommentTarget = { poem: p, index: i }; }
</script>

<NavHost />
<main>
        <Hero on:cinematic={() => { showMuseum = true; museumScene = 0; }} />
        <About />
        <MusicPlayer {audioEl} {playing} {progress} {currentTime} {duration} {songLikes} {songLiked} {togglePlay} {seek} {likeSong} />
        <Fragments {likes} {liked} {comments} {commentInputs} {commentNames} {activeSheet} {longPressTimer} {showDeleteComment} {deleteCommentTarget} {deleteCommentPassword} {deleteCommentError} {handleLike} {postComment} {confirmDeleteComment} sharePoem={sharePoem} setActiveSheet={openSheet} startDeleteComment={startDeleteComment} />
        <Bookshelf />
        <Art /><Repos /><Footer />
</main>

{#if showMuseum}
        <div class="museum-overlay" on:click={nextMuseumScene}><div class="museum-scene" on:click|stopPropagation>
                <div class="museum-emoji">{museumScenes[museumScene].title}</div>
                <h2 class="museum-title">{museumScenes[museumScene].subtitle}</h2>
                <p class="museum-text">{museumScenes[museumScene].text}</p>
                <div class="museum-dots">{#each museumScenes as _, i}<span class="m-dot" class:active={i === museumScene}></span>{/each}</div>
                <p class="museum-hint">Tap anywhere to continue</p>
        </div></div>
{/if}

<CommentsSheet {comments} {activeSheet} {commentNames} {commentInputs} {showDeleteComment} {deleteCommentTarget} {deleteCommentPassword} {deleteCommentError} {longPressTimer} {postComment} {confirmDeleteComment} {closeSheet} startDelete={startDeleteComment} />

<style lang="scss">
        .museum-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s ease; cursor: pointer; }
        .museum-scene { text-align: center; padding: 2rem; animation: sceneIn 0.6s ease; } .museum-emoji { font-size: 6rem; margin-bottom: 1rem; animation: float 3s ease infinite; }
        .museum-title { font-size: 2rem; color: var(--accent); margin-bottom: 0.5rem; font-weight: 600; }
        .museum-text { font-size: 1.2rem; color: var(--text-secondary); max-width: 400px; margin: 0 auto 2rem auto; line-height: 1.8; }
        .museum-dots { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; } .m-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s; } .m-dot.active { background: var(--accent); width: 24px; border-radius: 4px; }
        .museum-hint { font-size: 0.8rem; color: rgba(255,255,255,0.3); animation: pulse 2s ease infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes sceneIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
</style>