<script lang="ts">
        import Social from '../atoms/Social.svelte';

        import { InstagramIcon } from '@indaco/svelte-iconoir/instagram';
        import { XIcon } from '@indaco/svelte-iconoir/x';
        import { MailIcon } from '@indaco/svelte-iconoir/mail';
        import { CoffeeCupIcon } from '@indaco/svelte-iconoir/coffee-cup';
        import { LinkedInIcon } from '@indaco/svelte-iconoir/linkedin';

        let showDonate = false;
        let upiID = 'lonenasir724@okaxis';
        let upiName = 'Nasir Lone';
        let copied = false;

        function copyUPI() {
                navigator.clipboard.writeText(upiID);
                copied = true;
                setTimeout(() => copied = false, 2000);
        }

        function openUPIApp(app: string) {
                if (app === 'gpay') {
                        window.open(`gpay://upi/pay?pa=${upiID}&pn=${encodeURIComponent(upiName)}&cu=INR`, '_blank');
                } else if (app === 'phonepe') {
                        window.open(`phonepe://pay?pa=${upiID}&pn=${encodeURIComponent(upiName)}&cu=INR`, '_blank');
                } else if (app === 'paytm') {
                        window.open(`paytmmp://pay?pa=${upiID}&pn=${encodeURIComponent(upiName)}&cu=INR`, '_blank');
                } else {
                        window.open(`upi://pay?pa=${upiID}&pn=${encodeURIComponent(upiName)}&cu=INR`, '_blank');
                }
        }
</script>

<div class="socials-wrapper">
        <div class="socials-container">
                <Social tip="@nacirlone" link="https://instagram.com/nacirlone">
                        <InstagramIcon color="var(--accent)" width="24px" height="24px" />
                </Social>

                <Social tip="@leavingheretostay" link="https://in.linkedin.com/in/leavingheretostay">
                        <LinkedInIcon color="var(--accent)" width="24px" height="24px" />
                </Social>

                <Social tip="@beingkashmire" link="https://twitter.com/beingkashmire">
                        <XIcon color="var(--accent)" width="24px" height="24px" />
                </Social>

                <Social tip="Mail Me" link="mailto:lonenasir724@gmail.com">
                        <MailIcon color="var(--accent)" width="24px" height="24px" />
                </Social>

                <button class="coffee-btn" on:click={() => showDonate = !showDonate} title="Buy me a coffee">
                        <CoffeeCupIcon color="var(--accent)" width="24px" height="24px" />
                </button>
        </div>

        {#if showDonate}
                <div class="donate-overlay" on:click={() => showDonate = false}>
                        <div class="donate-popup" on:click|stopPropagation>
                                <h4>Buy me a coffee ☕</h4>
                                
                                <div class="upi-apps">
                                        <button class="upi-app gpay" on:click={() => openUPIApp('gpay')}>
                                                Google Pay
                                        </button>
                                        <button class="upi-app phonepe" on:click={() => openUPIApp('phonepe')}>
                                                PhonePe
                                        </button>
                                        <button class="upi-app paytm" on:click={() => openUPIApp('paytm')}>
                                                Paytm
                                        </button>
                                </div>

                                <div class="upi-divider">
                                        <span>or copy UPI ID</span>
                                </div>

                                <div class="upi-box">
                                        <code>{upiID}</code>
                                        <button on:click={copyUPI}>
                                                {copied ? 'Copied!' : 'Copy'}
                                        </button>
                                </div>
                                
                                <p class="upi-note">Opens your payment app to send support 💛</p>
                        </div>
                </div>
        {/if}
</div>

<style>
        .socials-wrapper {
                display: flex;
                justify-content: center;
                width: 100%;
        }

        .socials-container {
                display: flex;
                gap: 0.75rem;
                align-items: center;
                justify-content: center;
        }

        .coffee-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 0;
        }

        .coffee-btn:hover {
                transform: scale(1.1);
                transition: transform 0.2s;
        }

        .donate-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(3px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
        }

        .donate-popup {
                background: var(--bg-color);
                border: 1px solid var(--elevation-four);
                border-radius: 14px;
                padding: 1.25rem;
                max-width: 300px;
                width: 90%;
                text-align: center;
        }

        .donate-popup h4 {
                margin: 0 0 0.75rem 0;
                font-size: 1rem;
        }

        .upi-apps {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                justify-content: center;
        }

        .upi-app {
                padding: 0.5rem 0.75rem;
                border-radius: 8px;
                border: 1px solid var(--elevation-four);
                background: var(--elevation-one);
                color: var(--text-primary);
                cursor: pointer;
                font-size: 0.8rem;
                font-family: var(--font-two);
        }

        .upi-app:hover {
                filter: brightness(1.1);
        }

        .upi-divider {
                color: var(--text-secondary);
                font-size: 0.7rem;
                margin: 0.75rem 0;
        }

        .upi-box {
                display: flex;
                gap: 0.5rem;
                align-items: center;
                justify-content: center;
        }

        .upi-box code {
                background: var(--elevation-one);
                padding: 0.35rem 0.6rem;
                border-radius: 6px;
                font-size: 0.75rem;
        }

        .upi-box button {
                background: var(--elevation-one);
                border: 1px solid var(--elevation-four);
                color: var(--text-primary);
                padding: 0.3rem 0.6rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.75rem;
        }

        .upi-note {
                color: var(--text-secondary);
                font-size: 0.7rem;
                margin: 0.5rem 0 0 0;
        }
</style>