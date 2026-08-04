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

                // ============ SPACE BACKGROUND ============
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

                        // --- Stars ---
                        interface Star {
                                x: number; y: number; r: number;
                                twinkle: number; twinkleSpeed: number;
                                baseOpacity: number;
                        }
                        const stars: Star[] = [];
                        for (let i = 0; i < 180; i++) {
                                stars.push({
                                        x: Math.random() * width,
                                        y: Math.random() * height,
                                        r: Math.random() * 2 + 0.3,
                                        twinkle: Math.random() * Math.PI * 2,
                                        twinkleSpeed: Math.random() * 0.015 + 0.005,
                                        baseOpacity: Math.random() * 0.7 + 0.3
                                });
                        }

                        // --- Slow drifting dust ---
                        interface Dust {
                                x: number; y: number; r: number;
                                vx: number; vy: number;
                                opacity: number;
                        }
                        const dust: Dust[] = [];
                        for (let i = 0; i < 50; i++) {
                                dust.push({
                                        x: Math.random() * width,
                                        y: Math.random() * height,
                                        r: Math.random() * 1.2 + 0.3,
                                        vx: (Math.random() - 0.5) * 0.2,
                                        vy: (Math.random() - 0.5) * 0.2,
                                        opacity: Math.random() * 0.35 + 0.1
                                });
                        }

                        // --- Shooting stars ---
                        interface ShootingStar {
                                x: number; y: number; len: number;
                                speed: number; angle: number;
                                opacity: number; active: boolean;
                        }
                        const shootingStars: ShootingStar[] = [];
                        for (let i = 0; i < 3; i++) {
                                shootingStars.push({
                                        x: 0, y: 0, len: 0,
                                        speed: 0, angle: 0,
                                        opacity: 0, active: false
                                });
                        }

                        function spawnShootingStar(s: ShootingStar) {
                                s.x = Math.random() * width;
                                s.y = Math.random() * height * 0.6;
                                s.len = Math.random() * 120 + 60;
                                s.speed = Math.random() * 6 + 4;
                                s.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
                                s.opacity = 1;
                                s.active = true;
                        }

                        function animate() {
                                updateAccentColor();
                                ctx.clearRect(0, 0, width, height);

                                // --- Central nebula glow ---
                                const glow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) * 0.45);
                                glow.addColorStop(0, `rgba(${accentRGB}, 0.05)`);
                                glow.addColorStop(0.4, `rgba(${accentRGB}, 0.015)`);
                                glow.addColorStop(1, 'transparent');
                                ctx.fillStyle = glow;
                                ctx.fillRect(0, 0, width, height);

                                // --- Cosmic dust ---
                                for (const d of dust) {
                                        d.x += d.vx;
                                        d.y += d.vy;
                                        if (d.x < -10) d.x = width + 10;
                                        if (d.x > width + 10) d.x = -10;
                                        if (d.y < -10) d.y = height + 10;
                                        if (d.y > height + 10) d.y = -10;
                                        ctx.beginPath();
                                        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                                        ctx.fillStyle = `rgba(${accentRGB}, ${d.opacity})`;
                                        ctx.fill();
                                }

                                // --- Stars ---
                                for (const s of stars) {
                                        s.twinkle += s.twinkleSpeed;
                                        const alpha = s.baseOpacity * (0.6 + 0.4 * Math.sin(s.twinkle));
                                        ctx.beginPath();
                                        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                                        ctx.fill();
                                        if (s.r > 1.3) {
                                                const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
                                                halo.addColorStop(0, `rgba(200, 210, 255, ${alpha * 0.35})`);
                                                halo.addColorStop(1, 'transparent');
                                                ctx.fillStyle = halo;
                                                ctx.beginPath();
                                                ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
                                                ctx.fill();
                                        }
                                }

                                // --- Shooting stars ---
                                for (const s of shootingStars) {
                                        if (!s.active && Math.random() < 0.003) {
                                                spawnShootingStar(s);
                                        }
                                        if (s.active) {
                                                s.x += Math.cos(s.angle) * s.speed;
                                                s.y += Math.sin(s.angle) * s.speed;
                                                s.opacity -= 0.012;
                                                if (s.opacity <= 0 || s.x < -50 || s.x > width + 50 || s.y < -50 || s.y > height + 50) {
                                                        s.active = false;
                                                        s.opacity = 0;
                                                } else {
                                                        const ex = s.x - Math.cos(s.angle) * s.len;
                                                        const ey = s.y - Math.sin(s.angle) * s.len;
                                                        const gradient = ctx.createLinearGradient(ex, ey, s.x, s.y);
                                                        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
                                                        gradient.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);
                                                        ctx.beginPath();
                                                        ctx.moveTo(ex, ey);
                                                        ctx.lineTo(s.x, s.y);
                                                        ctx.strokeStyle = gradient;
                                                        ctx.lineWidth = 1.2;
                                                        ctx.stroke();
                                                }
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