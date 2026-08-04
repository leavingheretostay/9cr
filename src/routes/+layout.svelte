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

                // ============ MORPHE-STYLE SPACE ============
                const canvas = document.getElementById('particles') as HTMLCanvasElement;
                if (canvas) {
                        const ctx = canvas.getContext('2d')!;
                        let width: number, height: number;
                        let animationId: number;
                        let accentRGB = '167, 139, 250';

                        function updateAccentColor() {
                                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                                if (accent.startsWith('#')) {
                                        const r = parseInt(accent.slice(1, 3), 16);
                                        const g = parseInt(accent.slice(3, 5), 16);
                                        const b = parseInt(accent.slice(5, 7), 16);
                                        accentRGB = `${r}, ${g}, ${b}`;
                                }
                        }

                        function resize() {
                                width = canvas.width = window.innerWidth;
                                height = canvas.height = window.innerHeight;
                        }
                        resize();
                        window.addEventListener('resize', resize);

                        // Particle types: 0=small star, 1=medium, 2=large glowing, 3=dust
                        const particles: {
                                x: number; y: number; r: number;
                                vx: number; vy: number;
                                opacity: number; pulse: number; pulseSpeed: number;
                                type: number; hue: number;
                        }[] = [];

                        // Create 250 particles
                        for (let i = 0; i < 250; i++) {
                                const type = Math.random() < 0.1 ? 2 : (Math.random() < 0.3 ? 1 : (Math.random() < 0.6 ? 0 : 3));
                                particles.push({
                                        x: Math.random() * width,
                                        y: Math.random() * height,
                                        r: type === 2 ? Math.random() * 2.5 + 1.5 :
                                           type === 1 ? Math.random() * 1.5 + 0.5 :
                                           type === 3 ? Math.random() * 0.8 + 0.2 :
                                           Math.random() * 1 + 0.3,
                                        vx: (Math.random() - 0.5) * 0.5,
                                        vy: (Math.random() - 0.5) * 0.5,
                                        opacity: 0,
                                        pulse: Math.random() * Math.PI * 2,
                                        pulseSpeed: Math.random() * 0.02 + 0.005,
                                        type,
                                        hue: Math.random() * 60 + 220
                                });
                                particles[i].opacity = Math.random() * 0.6 + 0.2;
                        }

                        function animate() {
                                updateAccentColor();
                                // Semi-transparent clear for trail effect
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                                ctx.fillRect(0, 0, width, height);

                                for (const p of particles) {
                                        // Move
                                        p.x += p.vx;
                                        p.y += p.vy;

                                        // Wrap around edges
                                        if (p.x < -20) p.x = width + 20;
                                        if (p.x > width + 20) p.x = -20;
                                        if (p.y < -20) p.y = height + 20;
                                        if (p.y > height + 20) p.y = -20;

                                        // Subtle pulsing
                                        p.pulse += p.pulseSpeed;
                                        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

                                        if (p.type === 3) {
                                                // Dust - accent colored, very subtle
                                                ctx.beginPath();
                                                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                                                ctx.fillStyle = `rgba(${accentRGB}, ${alpha * 0.35})`;
                                                ctx.fill();
                                        } else if (p.type === 2) {
                                                // Large glowing star
                                                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                                                glow.addColorStop(0, `rgba(${accentRGB}, ${alpha * 0.5})`);
                                                glow.addColorStop(0.5, `rgba(${accentRGB}, ${alpha * 0.15})`);
                                                glow.addColorStop(1, 'transparent');
                                                ctx.fillStyle = glow;
                                                ctx.beginPath();
                                                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                                                ctx.fill();
                                                // Core
                                                ctx.beginPath();
                                                ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
                                                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                                                ctx.fill();
                                        } else {
                                                // Regular star
                                                ctx.beginPath();
                                                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                                                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                                                ctx.fill();
                                        }
                                }

                                animationId = requestAnimationFrame(animate);
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
                z-index: 0; pointer-events: none; display: block;
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