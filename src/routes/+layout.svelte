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
                } else {
                        window.addEventListener('load', () => {
                                loading = false;
                        }, { once: true });
                }

                const classes = document.body.classList;
                let resizeTimer: ReturnType<typeof setTimeout> | undefined;

                const handleResize = () => {
                        if (resizeTimer) clearTimeout(resizeTimer);
                        classes.add('stop-transitions');
                        resizeTimer = setTimeout(() => {
                                classes.remove('stop-transitions');
                                resizeTimer = undefined;
                        }, 120);
                };

                const handleScroll = () => {
                        if (window.scrollY > 300) {
                                showBackTop = true;
                                clearTimeout(scrollTimeout);
                                scrollTimeout = setTimeout(() => {
                                        showBackTop = false;
                                }, 1500);
                        } else {
                                showBackTop = false;
                                clearTimeout(scrollTimeout);
                        }
                };

                window.addEventListener('resize', handleResize, { passive: true });
                window.addEventListener('scroll', handleScroll, { passive: true });

                const canvas = document.getElementById('particles') as HTMLCanvasElement | null;
                const context = canvas?.getContext('2d');
                const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
                let animationFrame = 0;
                let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b';

                const resizeCanvas = () => {
                        if (!canvas) return;
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                        if (particles.length) {
                                particles.forEach((particle) => {
                                        particle.x = Math.min(particle.x, canvas.width);
                                        particle.y = Math.min(particle.y, canvas.height);
                                });
                        }
                };

                const stopAnimation = () => {
                        if (animationFrame) cancelAnimationFrame(animationFrame);
                        animationFrame = 0;
                };

                const animate = () => {
                        if (!canvas || !context || document.hidden || reducedMotion.matches) {
                                stopAnimation();
                                return;
                        }

                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.fillStyle = accent;
                        context.globalAlpha = 0.3;

                        particles.forEach((particle) => {
                                particle.x += particle.vx;
                                particle.y += particle.vy;
                                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                                context.beginPath();
                                context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                                context.fill();
                        });

                        context.globalAlpha = 1;
                        animationFrame = requestAnimationFrame(animate);
                };

                const startAnimation = () => {
                        stopAnimation();
                        if (!canvas || !context || document.hidden || reducedMotion.matches) return;
                        if (!particles.length) {
                                particles = Array.from({ length: 40 }, () => ({
                                        x: Math.random() * canvas.width,
                                        y: Math.random() * canvas.height,
                                        vx: (Math.random() - 0.5) * 0.5,
                                        vy: (Math.random() - 0.5) * 0.5,
                                        size: Math.random() * 2 + 1
                                }));
                        }
                        animationFrame = requestAnimationFrame(animate);
                };

                const handleVisibilityChange = () => {
                        if (document.hidden) stopAnimation();
                        else startAnimation();
                };

                const handleMotionPreferenceChange = () => {
                        if (reducedMotion.matches) {
                                stopAnimation();
                                context?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
                        } else {
                                startAnimation();
                        }
                };

                resizeCanvas();
                startAnimation();
                window.addEventListener('resize', resizeCanvas, { passive: true });
                document.addEventListener('visibilitychange', handleVisibilityChange);
                reducedMotion.addEventListener?.('change', handleMotionPreferenceChange);

                return () => {
                        stopAnimation();
                        window.removeEventListener('resize', handleResize);
                        window.removeEventListener('resize', resizeCanvas);
                        window.removeEventListener('scroll', handleScroll);
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                        reducedMotion.removeEventListener?.('change', handleMotionPreferenceChange);
                        if (resizeTimer) clearTimeout(resizeTimer);
                        clearTimeout(scrollTimeout);
                };
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
                z-index: 0; pointer-events: none;
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

        @media (max-width: 768px) {
                .back-to-top { bottom: 5rem; right: 1rem; width: 44px; height: 44px; }
        }

        @media (prefers-reduced-motion: reduce) {
                #particles { display: none; }
        }
</style>