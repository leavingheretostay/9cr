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

                // Cosmic Space Warp Particles
                const canvas = document.getElementById('particles') as HTMLCanvasElement;
                if (canvas) {
                        const ctx = canvas.getContext('2d')!;
                        let stars: { x: number; y: number; z: number; size: number; speed: number; color: string }[] = [];
                        
                        const colors = [
                                '#ffffff', // bright white
                                '#c9d8ff', // blue-white
                                '#a78bfa', // accent purple
                                '#e0e7ff', // soft blue
                                '#f0e6ff', // lavender
                                '#7dd3fc', // sky blue
                        ];

                        function resize() {
                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;
                        }
                        resize();
                        window.addEventListener('resize', resize);

                        // Create 300 stars scattered across 3D space
                        for (let i = 0; i < 300; i++) {
                                stars.push({
                                        x: (Math.random() - 0.5) * canvas.width * 3,
                                        y: (Math.random() - 0.5) * canvas.height * 3,
                                        z: Math.random() * 1500 + 100,
                                        size: Math.random() * 2.5 + 0.5,
                                        speed: Math.random() * 4 + 1.5,
                                        color: colors[Math.floor(Math.random() * colors.length)]
                                });
                        }

                        function animate() {
                                // Fade effect instead of clear - creates trails
                                ctx.fillStyle = 'rgba(2, 2, 15, 0.15)';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                
                                const centerX = canvas.width / 2;
                                const centerY = canvas.height / 2;

                                ctx.save();
                                ctx.translate(centerX, centerY);

                                // Draw central glow
                                const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
                                glow.addColorStop(0, 'rgba(167, 139, 250, 0.08)');
                                glow.addColorStop(0.5, 'rgba(125, 211, 252, 0.03)');
                                glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                                ctx.fillStyle = glow;
                                ctx.beginPath();
                                ctx.arc(0, 0, 300, 0, Math.PI * 2);
                                ctx.fill();

                                for (let i = 0; i < stars.length; i++) {
                                        const star = stars[i];
                                        
                                        // Move star toward viewer
                                        star.z -= star.speed;
                                        
                                        // Reset star when it passes the viewer
                                        if (star.z <= 10) {
                                                star.x = (Math.random() - 0.5) * canvas.width * 3;
                                                star.y = (Math.random() - 0.5) * canvas.height * 3;
                                                star.z = 1500;
                                                star.size = Math.random() * 2.5 + 0.5;
                                                star.speed = Math.random() * 4 + 1.5;
                                                star.color = colors[Math.floor(Math.random() * colors.length)];
                                        }

                                        // Project 3D to 2D
                                        const px = (star.x / star.z) * 400;
                                        const py = (star.y / star.z) * 400;
                                        
                                        // Size based on depth
                                        const depth = 1 - (star.z / 1500);
                                        const size = depth * star.size * 2.5;
                                        
                                        // Opacity based on depth
                                        const alpha = depth * 0.9;
                                        
                                        // Only draw if on screen
                                        if (Math.abs(px) < canvas.width && Math.abs(py) < canvas.height) {
                                                // Trail from previous position
                                                const prevZ = star.z + star.speed * 3;
                                                const prevX = (star.x / prevZ) * 400;
                                                const prevY = (star.y / prevZ) * 400;
                                                
                                                // Draw trail
                                                ctx.beginPath();
                                                ctx.moveTo(prevX, prevY);
                                                ctx.lineTo(px, py);
                                                ctx.strokeStyle = star.color;
                                                ctx.globalAlpha = alpha * 0.3;
                                                ctx.lineWidth = size * 0.4;
                                                ctx.stroke();
                                                
                                                // Glow around star
                                                const starGlow = ctx.createRadialGradient(px, py, 0, px, py, size * 2);
                                                starGlow.addColorStop(0, star.color);
                                                starGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                                                ctx.fillStyle = starGlow;
                                                ctx.globalAlpha = alpha * 0.4;
                                                ctx.beginPath();
                                                ctx.arc(px, py, size * 2, 0, Math.PI * 2);
                                                ctx.fill();
                                                
                                                // Draw star core
                                                ctx.beginPath();
                                                ctx.arc(px, py, size, 0, Math.PI * 2);
                                                ctx.fillStyle = star.color;
                                                ctx.globalAlpha = alpha;
                                                ctx.fill();
                                        }
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