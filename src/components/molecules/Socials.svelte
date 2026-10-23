<script lang="ts">
        import Social from '../atoms/Social.svelte';

        import { InstagramIcon } from '@indaco/svelte-iconoir/instagram';
        import { XIcon } from '@indaco/svelte-iconoir/x';
        import { MailIcon } from '@indaco/svelte-iconoir/mail';
        import { LinkedInIcon } from '@indaco/svelte-iconoir/linkedin';
</script>

<div class="socials-container">
        <Social tip="Instagram" link="https://instagram.com/9crlone">
                <InstagramIcon color="var(--accent)" />
        </Social>

        <Social tip="LinkedIn" link="https://in.linkedin.com/in/leavingheretostay">
                <LinkedInIcon color="var(--accent)" />
        </Social>

        <Social tip="X (Formerly Twitter)" link="https://twitter.com/beingkashmire">
                <XIcon color="var(--accent)" />
        </Social>

        <Social tip="Mail Me" link="mailto:lonenasir724@gmail.com">
                <MailIcon color="var(--accent)" />
        </Social>
</div>

<style>
        .socials-container {
                display: flex;
                flex-wrap: wrap;
                gap: 0.85rem;
                align-items: center;
                justify-content: center;
                width: 100%;
        }

        @media (max-width: 480px) {
                .socials-container {
                        gap: 0.65rem;
                }
        }
</style>
