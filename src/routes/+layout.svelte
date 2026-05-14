<script lang="ts">
        import { onMount } from 'svelte';
        import '../styles/global.scss';
        import '../styles/fonts.scss';
        import Cursor from '../components/atoms/Cursor.svelte';
        import { playSharedSFX } from '../util/audio';

        let loading = true;
        let playSFX: (() => void) | undefined;
        let progress = 0;

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

                // Reading progress
                window.addEventListener('scroll', () => {
                        const scrollTop = window.scrollY;
                        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                        progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                });

                // Particles
                const canvas = document.getElementById('particles') as HTMLCanvasElement;
                if (canvas) {
                        const ctx = canvas.getContext('2d')!;
                        let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

                        function resize() {
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                        }
                        resize();
                        window.addEventListener('resize', resize);

                        for (let i = 0; i < 40; i++) {
                                particles.push({
                                        x: Math.random() * canvas.width,
                                        y: Math.random() * canvas.height,
                                        vx: (Math.random() - 0.5) * 0.5,
                                        vy: (Math.random() - 0.5) * 0.5,
                                        size: Math.random() * 2 + 1
                                });
                        }

                        function animate() {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b';
                                particles.forEach(p => {
                                        p.x += p.vx;
                                        p.y += p.vy;
                                        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                                        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                                        ctx.beginPath();
                                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                                        ctx.fillStyle = accent;
                                        ctx.globalAlpha = 0.3;
                                        ctx.fill();
                                });
                                requestAnimationFrame(animate);
                        }
                        animate();
                }
        });
</script>

<svelte:head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="og:title" content="9cr" />
        <meta content="https://i.postimg.cc/s2Hmshnf/1778611198152.jpg" property="og:image" />
        <meta property="og:description" content="Just a boy on the yellow brick road, searching for the viz!" />
        <meta name="twitter:image" itemprop="image" content="https://i.postimg.cc/s2Hmshnf/1778611198152.jpg" />
        <meta name="twitter:card" content="summary" />
        <title>9cr</title>
</svelte:head>

<svelte:window on:click={playSFX} />

<!-- Particles Background -->
<canvas id="particles"></canvas>

<!-- Reading Progress Bar -->
<div class="progress-bar" style="width: {progress}%"></div>

<!-- Back to Top Button -->
{#if progress > 15}
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
        .loading * {
                transition: none;
        }

        #particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
        }

        .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: var(--accent);
                z-index: 9999;
                transition: width 0.1s linear;
                border-radius: 0 3px 3px 0;
        }

        .back-to-top {
                position: fixed;
                bottom: 2rem;
                right: 1.5rem;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: var(--accent);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9998;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                animation: fadeInUp 0.3s ease;
                transition: transform 0.2s, filter 0.2s;
        }

        .back-to-top:hover {
                transform: translateY(-3px);
                filter: brightness(1.15);
        }

        @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
                .back-to-top {
                        bottom: 5rem;
                        right: 1rem;
                        width: 38px;
                        height: 38px;
                }
        }
</style>