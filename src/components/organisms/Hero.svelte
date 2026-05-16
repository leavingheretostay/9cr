<script>
        import HeroImage from '../../components/atoms/HeroImage.svelte';
        import Button from '../atoms/Button.svelte';
        import Socials from '../molecules/Socials.svelte';
        import { createEventDispatcher } from 'svelte';

        const dispatch = createEventDispatcher();

        function handleClick() {
                dispatch('cinematic');
        }
</script>

<section id="home" class="wrapper">
        <div class="hero-top">
                <span class="floating-tag">✦ Just a boy on the yellow brick road searching for the wiz ✦</span>
        </div>
        <div>
                <h1 aria-label="Nasir">
                        <span class="char">N</span><span class="char long">a</span><span class="char">s</span><span
                                class="char long">i</span
                        ><span class="char">r</span>
                </h1>
                <h4>Physical Science at KU.<br />Drawn toward silence, poetry, atoms and everything they become.</h4>
                <div class="socials">
                        <Socials />
                </div>
                <Button side on:click={handleClick}>Anyway, here ↓</Button>
        </div>
        <HeroImage />
</section>

<style lang="scss">
        @import '../../styles/mixins.scss';

        section {
                scroll-margin-top: 20rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5.75rem;
                margin-top: 7rem;
                position: relative;

                @media screen and (max-width: 868px) {
                        margin-top: 4rem;
                }

                @media screen and (max-width: 768px) {
                        margin-bottom: 2.75rem;
                }

                @media screen and (max-width: 500px) {
                        display: block;
                }
        }

        .hero-top {
                position: absolute;
                top: -1.8rem;              /* lowered from -2.8rem → more breathing room above the name */
                left: 50%;
                transform: translateX(-50%);
                z-index: 1;
                width: 100%;
                text-align: center;
                padding: 0 1rem;
                
                @media screen and (max-width: 868px) {
                        top: -2.5rem;         /* tablet – unchanged */
                }
                @media screen and (max-width: 600px) {
                        top: -2.2rem;         /* phone – unchanged */
                }
        }

        .floating-tag {
                font-family: var(--font-one);
                font-size: 0.75rem;
                color: var(--accent);
                opacity: 0.5;
                letter-spacing: 1.5px;
                text-transform: lowercase;
                animation: floatTag 4s ease-in-out infinite;
                line-height: 1.3;
                display: inline-block;
                max-width: 90vw;
                
                @media screen and (max-width: 600px) {
                        font-size: 0.65rem;
                }
                @media screen and (max-width: 400px) {
                        font-size: 0.6rem;
                }
        }

        @keyframes floatTag {
                0%, 100% { transform: translateY(0); opacity: 0.45; }
                50%      { transform: translateY(-4px); opacity: 0.6; }
        }

        .socials {
                margin-top: 1rem;
                margin-bottom: 1.7rem;
        }

        h4 {
                margin-top: 1.4rem;
        }

        h1 {
                transform: scaleY(1.3);
                line-height: 8rem;

                .char {
                        display: inline-block;
                        animation: header-flicker 0.45s linear 2;
                        animation-fill-mode: forwards;
                }

                .char:nth-child(1) { animation-delay: 0.05s; }
                .char:nth-child(2) { animation-delay: 0.06s; }
                .char:nth-child(3) { animation-delay: 0.1s; }
                .char:nth-child(4) { animation-delay: 0.14s; }
                .char:nth-child(5) { animation-delay: 0.18s; }

                .char.long {
                        animation-name: header-flicker-long;
                        animation-duration: 0.9s;
                }
        }

        h4::before {
                @include outlineText(
                        $content: '///',
                        $translateX: -95%,
                        $translateY: -75%,
                        $letterSpacing: -0.1em
                );
        }

        @keyframes header-flicker {
                0%, 100% { opacity: 1; filter: brightness(1); }
                6% { opacity: 0.35; filter: brightness(0.7); }
                10% { opacity: 1; }
                18% { opacity: 0.55; }
                22%, 62% { opacity: 1; }
                66% { opacity: 0.45; }
                70% { opacity: 1; }
                92% { opacity: 0.7; }
        }

        @keyframes header-flicker-long {
                0%, 100% { opacity: 1; filter: brightness(1); }
                4%, 8% { opacity: 0.3; filter: brightness(0.6); }
                12%, 22% { opacity: 1; }
                28% { opacity: 0.25; }
                34%, 44% { opacity: 1; }
                52% { opacity: 0.4; }
                60%, 74% { opacity: 1; }
                82% { opacity: 0.35; }
                90% { opacity: 1; }
        }

        @media screen and (max-width: 1240px) {
                h1 {
                        min-height: 0vw;
                        font-size: clamp(4rem, 10vw, 6.25rem);
                        line-height: 6rem;
                }
                h4 {
                        min-height: 0vw;
                        font-size: clamp(1.4rem, 2.4vw, 1.5rem);
                }
        }

        @media screen and (max-width: 400px) {
                h4 br {
                        content: '&#160;';
                }
        }
</style>