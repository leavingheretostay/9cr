<script lang="ts">
        import { onMount } from 'svelte';
        import '../styles/global.scss';
        import '../styles/fonts.scss';
        import Cursor from '../components/atoms/Cursor.svelte';
        import { playSharedSFX } from '../util/audio';

        let loading = true;
        let playSFX: (() => void) | undefined;
        let showBackTop = false;
        let scrollTimeout: ReturnType<typeof setTimeout>;

        onMount(() => {
                playSFX = () => {
                        void playSharedSFX('/sounds/click.ogg');
                };

                if (document.readyState === 'complete') {
                        loading = false;
                }

                const classes = document.querySelector('body')?.classList;
                const stopResizeAnimation = () => {
                        let timer: any = 0;
                        window.addEventListener('resize', function () {
                                if (timer) {
                                        clearTimeout(timer);
                                        timer = null;
                                } else {
                                        classes?.add('stop-transitions');
                                }
                                timer = setTimeout(() => {
                                        classes?.remove('stop-transitions');
                                        timer = null;
                                }, 100);
                        });
                };
                stopResizeAnimation();

                // Back to top - appears on scroll, disappears after stopping
                window.addEventListener('scroll', () => {
                        if (window.scrollY > 300) {
                                showBackTop = true;
                                clearTimeout(scrollTimeout);
                                scrollTimeout = setTimeout(() => {
                                        showBackTop = false;
                                }, 1500);
                        } else {
                                showBackTop = false;
                        }
                });

                // Space Warp Particles
                const canvas = document.getElementById('particles') as HTMLCanvasElement;
                if (canvas) {
                        const ctx = canvas.getContext('2d')!;
                        let stars: { x: number; y: number; z: number; size: number; speed: number }[] = [];
                        
                        // Center of the screen
                        const cx = window.innerWidth / 2;
                        const cy = window.innerHeight / 2;

                        function resize() {
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                        }
                        resize();
                        window.addEventListener('resize', resize);

                        // Create stars at random positions
                        for (let i = 0; i < 200; i++) {
                                stars.push({
                                        x: (Math.random() - 0.5) * window.innerWidth * 2,
                                        y: (Math.random() - 0.5) * window.innerHeight * 2,
                                        z: Math.random() * 1000 + 1,
                                        size: Math.random() * 2 + 0.5,
                                        speed: Math.random() * 3 + 1
                                });
                        }

                        function animate() {
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                
                                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#a78bfa';
                                const centerX = canvas.width / 2;
                                const centerY = canvas.height / 2;

                                ctx.save();
                                ctx.translate(centerX, centerY);

                                for (let i = 0; i < stars.length; i++) {
                                        const star = stars[i];
                                        
                                        // Move star toward viewer (increase z)
                                        star.z -= star.speed;
                                        
                                        // Reset star when it passes the viewer
                                        if (star.z <= 1) {
                                                star.x = (Math.random() - 0.5) * canvas.width * 2;
                                                star.y = (Math.random() - 0.5) * canvas.height * 2;
                                                star.z = 1000;
                                                star.size = Math.random() * 2 + 0.5;
                                                star.speed = Math.random() * 3 + 1;
                                        }

                                        // Project 3D to 2D
                                        const px = star.x / star.z * 300;
                                        const py = star.y / star.z * 300;
                                        
                                        // Size based on depth (closer = bigger)
                                        const size = (1 - star.z / 1000) * star.size * 3;
                                        
                                        // Opacity based on depth (closer = brighter)
                                        const alpha = (1 - star.z / 1000) * 0.8;
                                        
                                        // Trail effect - draw a line from previous position
                                        const prevZ = star.z + star.speed * 2;
                                        const prevX = star.x / prevZ * 300;
                                        const prevY = star.y / prevZ * 300;
                                        
                                        ctx.beginPath();
                                        ctx.moveTo(prevX, prevY);
                                        ctx.lineTo(px, py);
                                        ctx.strokeStyle = accent;
                                        ctx.globalAlpha = alpha * 0.5;
                                        ctx.lineWidth = size * 0.5;
                                        ctx.stroke();
                                        
                                        // Draw the star
                                        ctx.beginPath();
                                        ctx.arc(px, py, size, 0, Math.PI * 2);
                                        ctx.fillStyle = accent;
                                        ctx.globalAlpha = alpha;
                                        ctx.fill();
                                }

                                ctx.restore();
                                requestAnimationFrame(animate);
                        }
                        animate();
                }
        });
</script>

<svelte:head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f1117" />
        <meta name="og:title" content="9cr" />
        <meta content="https://i.postimg.cc/s2Hmshnf/1778611198152.jpg" property="og:image" />
        <meta property="og:description" content="Just a boy on the yellow brick road, searching for the viz!" />
        <meta name="twitter:image" itemprop="image" content="https://i.postimg.cc/s2Hmshnf/1778611198152.jpg" />
        <meta name="twitter:card" content="summary" />
        <title>9cr</title>
</svelte:head>

<svelte:window on:click={playSFX} />

<canvas id="particles"></canvas>

{#if showBackTop}
        <button class="back-to-top" on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="18 15 12 9 6 15"/>
                </svg>
        </button>
{/if}

<Cursor />
<span class:loading>
        <slot />
</span>

<style>
        .loading * { transition: none; }

        #particles {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: -1; pointer-events: none;
                background: var(--bg-color);
        }

        .back-to-top {
                position: fixed; bottom: 2rem; right: 1.5rem;
                width: 44px; height: 44px; border-radius: 50%;
                background: var(--accent); border: none; color: white;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                z-index: 9998; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                animation: fadeInUp 0.3s ease;
                transition: transform 0.2s, filter 0.2s, opacity 0.3s;
        }

        .back-to-top:hover {
                transform: translateY(-3px); filter: brightness(1.15);
        }

        @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
                .back-to-top { bottom: 5rem; right: 1rem; width: 38px; height: 38px; }
        }
</style>