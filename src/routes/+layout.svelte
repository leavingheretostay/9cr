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

                // ============ CINEMATIC 3D PARTICLE FIELD ============
                const canvas = document.getElementById('particles') as HTMLCanvasElement;
                if (canvas) {
                        const ctx = canvas.getContext('2d')!;
                        let width: number, height: number;
                        let animationId: number;
                        let particleColor = '167, 139, 250'; // default accent

                        // Get accent color for particles
                        function updateAccentColor() {
                                const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                                if (accent.startsWith('#')) {
                                        const r = parseInt(accent.slice(1, 3), 16);
                                        const g = parseInt(accent.slice(3, 5), 16);
                                        const b = parseInt(accent.slice(5, 7), 16);
                                        particleColor = `${r}, ${g}, ${b}`;
                                }
                        }

                        function resize() {
                                width = canvas.width = window.innerWidth;
                                height = canvas.height = window.innerHeight;
                        }

                        resize();
                        window.addEventListener('resize', resize);

                        // Particle class with true 3D perspective
                        class Particle3D {
                                x: number = 0;
                                y: number = 0;
                                z: number = 0;          // depth: 0 (far) to 1 (near)
                                vx: number = 0;          // horizontal drift
                                vy: number = 0;          // vertical drift
                                vz: number = 0;          // forward speed
                                size: number = 1;        // base size
                                opacity: number = 0.5;
                                blur: number = 0;        // Gaussian blur amount
                                life: number = 0;        // current lifetime progress
                                maxLife: number = 1;     // total lifetime

                                init(w: number, h: number) {
                                        // Random starting position in a wide area
                                        this.x = (Math.random() - 0.5) * w * 2;
                                        this.y = (Math.random() - 0.5) * h * 2;
                                        
                                        // Start from deep distance
                                        this.z = Math.random() * 0.05 + 0.01;
                                        
                                        // Very slow organic drift
                                        this.vx = (Math.random() - 0.5) * 0.3;
                                        this.vy = (Math.random() - 0.5) * 0.2;
                                        
                                        // Forward speed - varies per particle
                                        this.vz = Math.random() * 0.0004 + 0.0002;
                                        
                                        // Size variation - fewer large particles
                                        this.size = Math.random() < 0.15 
                                                ? Math.random() * 2 + 1.5   // 15% chance: larger
                                                : Math.random() * 1.2 + 0.3; // 85% chance: tiny
                                        
                                        this.opacity = Math.random() * 0.4 + 0.15;
                                        this.blur = Math.random() * 1.5;
                                        this.life = 0;
                                        this.maxLife = Math.random() * 0.8 + 0.4;
                                }

                                update(w: number, h: number) {
                                        // Move forward (increase depth)
                                        this.z += this.vz;
                                        this.life += 0.001;
                                        
                                        // Organic drift with subtle randomness
                                        this.x += this.vx + (Math.random() - 0.5) * 0.05;
                                        this.y += this.vy + (Math.random() - 0.5) * 0.03;
                                        
                                        // Reset when particle passes the viewer or expires
                                        if (this.z >= 0.95 || this.life >= this.maxLife) {
                                                this.init(w, h);
                                                this.z = 0.01; // start from far again
                                        }
                                }

                                draw(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
                                        // Perspective projection: z=0 far, z=1 near
                                        const scale = 0.3 + this.z * 2.5;
                                        const projectedSize = this.size * scale;
                                        
                                        // Calculate screen position with perspective
                                        const centerX = w / 2;
                                        const centerY = h / 2;
                                        const px = centerX + (this.x / (0.2 + this.z)) * 300;
                                        const py = centerY + (this.y / (0.2 + this.z)) * 200;
                                        
                                        // Skip if way off screen
                                        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) return;
                                        
                                        // Opacity fades in from distance, peaks mid-way, fades near
                                        const depthFade = this.z < 0.3 
                                                ? this.z / 0.3 
                                                : 1 - ((this.z - 0.3) / 0.65);
                                        const alpha = this.opacity * Math.max(0.1, depthFade) * 0.7;
                                        
                                        // Draw particle with optional blur
                                        if (this.blur > 0.5) {
                                                ctx.save();
                                                ctx.filter = `blur(${this.blur * scale * 0.8}px)`;
                                        }
                                        
                                        ctx.beginPath();
                                        ctx.arc(px, py, projectedSize, 0, Math.PI * 2);
                                        ctx.fillStyle = `rgba(${color}, ${alpha})`;
                                        ctx.fill();
                                        
                                        if (this.blur > 0.5) {
                                                ctx.restore();
                                        }
                                }
                        }

                        // Create particles
                        const particleCount = 120;
                        const particles3D: Particle3D[] = [];
                        
                        for (let i = 0; i < particleCount; i++) {
                                const p = new Particle3D();
                                p.init(width, height);
                                // Stagger initial depths
                                p.z = Math.random();
                                particles3D.push(p);
                        }

                        function animate() {
                                updateAccentColor();
                                ctx.clearRect(0, 0, width, height);
                                
                                // Draw faint center glow
                                const glow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.min(width, height) * 0.4);
                                glow.addColorStop(0, `rgba(${particleColor}, 0.04)`);
                                glow.addColorStop(0.5, `rgba(${particleColor}, 0.01)`);
                                glow.addColorStop(1, 'transparent');
                                ctx.fillStyle = glow;
                                ctx.fillRect(0, 0, width, height);

                                // Sort by depth for proper rendering
                                particles3D.sort((a, b) => b.z - a.z);
                                
                                for (const p of particles3D) {
                                        p.update(width, height);
                                        p.draw(ctx, width, height, particleColor);
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