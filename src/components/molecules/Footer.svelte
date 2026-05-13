<script lang="ts">
        import Socials from './Socials.svelte';
        import SignatureWall from './SignatureWall.svelte';
</script>

<hr />

<SignatureWall hideAddButton={false} />

<footer class="wrapper">
        <Socials />
        <h6 class="footer-meta">
                Made with love 💗
        </h6>
</footer>

<style lang="scss">
        hr {
                background-color: var(--elevation-one);
                height: 1px;
                border: 0;
                width: 100%;
                margin-bottom: 4rem;

                @media screen and (max-width: 768px) {
                        margin-bottom: 3rem;
                }
        }

        footer {
                padding-bottom: 2.4rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 1rem;

                @media screen and (max-width: 768px) {
                        flex-direction: column;
                }
        }

        .footer-meta {
                text-align: center;
                line-height: 2.5rem;
                margin-top: 0;
        }
</style>