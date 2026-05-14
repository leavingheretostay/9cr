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

<!-- Reading Progress Bar -->
<div class="progress-bar" style="width: {progress}%"></div>

<Cursor />
<span class:loading>
        <slot />
</span>

<style>
        .loading * {
                transition: none;
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
</style>