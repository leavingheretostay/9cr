<script lang="ts">
        // Only your own project – no external API needed
        const repos = [
                {
                        link: 'https://github.com/leavingheretostay/Whisper',
                        owner: 'leavingheretostay',
                        repo: 'Whisper',
                        description: 'Receive anonymous thoughts & confessions beautifully.',
                        language: 'TypeScript',
                        languageColor: '#3178c6',
                        stars: '0',
                        forks: '0'
                }
        ];
</script>

<section class="wrapper" id="code">
        <div class="title">
                <h2>oss</h2>
        </div>
        <div class="grid">
                {#each repos as { link, owner, repo, description, languageColor, language, stars, forks }}
                        <a href={link} target="_blank" rel="noreferrer">
                                <div class="repo-card">
                                        <div id="top-part">
                                                <div class="info">
                                                        <img src="https://github.com/{owner}.png" alt="{owner}'s profile picture" id="pfp" />
                                                        <h6>{owner}</h6>
                                                </div>
                                                <div id="open">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                                </div>
                                        </div>
                                        <div>
                                                <h3>{repo}</h3>
                                                <h6>{description}</h6>
                                        </div>
                                        <div class="info-container">
                                                <div class="info">
                                                        <span class="dot" style="background-color: {languageColor}" />
                                                        <h6>{language}</h6>
                                                </div>
                                                <div class="info">
                                                        {#if stars}
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                                                <h6>{stars}</h6>
                                                        {/if}
                                                </div>
                                                <div class="info">
                                                        {#if forks}
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                                                                <h6>{forks}</h6>
                                                        {/if}
                                                </div>
                                        </div>
                                </div>
                        </a>
                {/each}
        </div>
</section>

<style lang="scss">
        @import '../../styles/mixins.scss';

        .title {
                display: flex;
                justify-content: center;
                margin-top: 0;

                @media (max-width: 868px) {
                        justify-content: left;
                }
        }

        .repo-card {
                padding: 1rem 1.25rem;
                background-color: var(--elevation-two);
                border-radius: 8px;
                min-height: 140px;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                transition: transform 0.3s var(--bezier-one), box-shadow 0.3s var(--bezier-one);
                justify-content: space-between;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                background-blend-mode: overlay;
                border: 1px solid var(--elevation-four);

                &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0px 15px 25px -10px rgba(0, 0, 0, 0.25);
                        #open { filter: brightness(1.3); }
                }
        }

        a {
                text-decoration: none;
                color: var(--text-primary);
                height: 100%;
                border-radius: 8px;
        }

        h2 {
                display: inline-block;
                margin-bottom: 1rem;
        }

        #pfp {
                border-radius: 50%;
                height: 16px;
        }

        #top-part {
                display: flex;
                justify-content: space-between;
        }

        #open {
                height: 20px;
                transition: filter 0.3s var(--bezier-one);
        }

        .grid {
                gap: 0.8rem;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                display: grid;
                grid-template-columns: 1fr 1fr;
                margin-bottom: 5rem;
                position: relative;

                &:before {
                        @include outlineText($content: 'λ', $translateX: 1150%, $translateY: -30%);
                }

                @media (max-width: 600px) {
                        grid-template-columns: 1fr;
                }

                @media (max-width: 868px) {
                        margin-bottom: 2rem;
                }
        }

        .dot {
                height: 11px;
                width: 11px;
                border-radius: 50%;
                display: inline-block;
        }

        .info {
                display: flex;
                gap: 0.2rem;
                align-items: center;

                &-container {
                        display: flex;
                        gap: 0.9rem;
                }
        }
</style>