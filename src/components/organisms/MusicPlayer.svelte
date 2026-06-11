<script lang="ts">
        export let playing: boolean;
        export let progress: number;
        export let currentTime: string;
        export let duration: string;
        export let songLikes: number;
        export let songLiked: boolean;
        export let togglePlay: () => void;
        export let seek: (e: MouseEvent | TouchEvent) => void;
        export let likeSong: () => void;
        export let audioLoading: boolean = true;
</script>

<section id="music" class="music wrapper">
        <h2>music</h2>
        <div class="music-player" style="background-image: url('https://i.postimg.cc/tJ3DDYyt/3fbc804b902583553c7626f1926a23a9.jpg');">
                {#if audioLoading}
                        <div class="music-loading">
                                <div class="loading-pulse"></div>
                                <span class="loading-text">loading track...</span>
                        </div>
                {:else}
                        <div class="music-overlay">
                                <div class="player-header"><span class="player-label">9CR Player</span></div>
                                <div class="player-info"><h3 class="song-title">Deedaar</h3><p class="song-artist">Third Hour</p></div>
                                <div class="player-buttons">
                                        <button class="ctrl-btn small" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="19,4 8,12 19,20"/><rect x="4" y="4" width="3" height="16" rx="1"/></svg></button>
                                        <button class="ctrl-btn play-btn" on:click={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                                                {#if playing}<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                                                {:else}<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="7,4 20,12 7,20"/></svg>{/if}
                                        </button>
                                        <button class="ctrl-btn small" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5,4 16,12 5,20"/><rect x="17" y="4" width="3" height="16" rx="1"/></svg></button>
                                        <button class="ctrl-btn small like-btn" class:liked={songLiked} on:click={likeSong} aria-label="Like">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill={songLiked ? '#ef4444' : 'none'} stroke="white" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><rect x="2" y="9" width="4" height="11"/></svg>
                                                <span class="like-count">{songLikes}</span>
                                        </button>
                                </div>
                                <div class="progress-area"><div class="progress-track" on:mousedown={seek} on:touchstart={seek}><div class="progress-fill" style="width: {progress}%"></div></div><div class="time-labels"><span>{currentTime}</span><span>{duration}</span></div></div>
                        </div>
                {/if}
        </div>
</section>

<style lang="scss">
        .music { margin-top: 5rem; width: 100%; max-width: 700px; } .music h2 { font-size: 2rem; margin-bottom: 2rem; }
        .music-player { border-radius: 16px; overflow: hidden; background-size: cover; background-position: center; height: 200px; position: relative; }
        
        /* Loading state */
        .music-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                gap: 0.75rem;
        }
        .loading-pulse {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: var(--accent);
                animation: loadingPulse 1.2s ease-in-out infinite;
        }
        .loading-text {
                font-size: 0.65rem;
                color: rgba(255,255,255,0.55);
                font-family: var(--font-two);
                letter-spacing: 1px;
                text-transform: uppercase;
        }
        @keyframes loadingPulse {
                0%, 100% { opacity: 0.35; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1); }
        }

        /* Player (when loaded) */
        .music-overlay { background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); padding: 1.25rem 1.25rem 1rem 1.25rem; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; }
        .player-label { font-size: 0.6rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 2px; font-family: var(--font-two); }
        .player-info { display: flex; flex-direction: column; gap: 0.15rem; } 
        .song-title { font-size: 1.1rem; color: white; font-weight: 600; margin: 0; } 
        .song-artist { font-size: 0.8rem; color: rgba(255,255,255,0.75); margin: 0; }
        .player-buttons { display: flex; align-items: center; gap: 0.5rem; } 
        .ctrl-btn { background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; } 
        .ctrl-btn.small { width: 30px; height: 30px; } 
        .ctrl-btn.play-btn { width: 38px; height: 38px; background: rgba(255,255,255,0.2); border-radius: 50%; } 
        .ctrl-btn:hover { transform: scale(1.08); }
        .like-btn { gap: 0.2rem; } .like-count { font-size: 0.65rem; color: rgba(255,255,255,0.7); }
        .progress-area { width: 100%; margin-top: 0.1rem; } 
        .progress-track { width: 100%; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; cursor: pointer; } 
        .progress-fill { height: 100%; background: white; border-radius: 2px; transition: width 0.3s linear; }
        .time-labels { display: flex; justify-content: space-between; margin-top: 0.2rem; } 
        .time-labels span { font-size: 0.55rem; color: rgba(255,255,255,0.55); }
</style>
