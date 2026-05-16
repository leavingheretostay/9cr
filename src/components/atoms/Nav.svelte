<script lang="ts">
        export let href = '#';
        export let section = 'home';
        export let isSelected: boolean;

        import { page } from '$app/stores';
        let currentPage = $page.url.pathname;

        async function handleClick() {
                if (currentPage !== '/') {
                        window.location.href = '/' + href;
                        return;
                }
                const el = document.querySelector(href);
                if (!el) return;
                el.scrollIntoView({ behavior: 'smooth' });
        }
</script>

<li class:selected={isSelected}>
        <button on:click={handleClick} aria-label={section}>
                <div class="icon-container">
                        <slot />
                </div>
        </button>
</li>

<style lang="scss">
        li {
                text-decoration: none;
                list-style: none;
        }

        button {
                background-color: transparent;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                border-radius: 50%;
                transition: background-color 0.3s var(--bezier-one), transform 0.3s var(--bezier-one);
        }

        .icon-container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 38px;                /* fixed size for the icon circle */
                height: 38px;
                border-radius: 50%;
                transition: background-color 0.3s var(--bezier-one);
        }

        /* Active state: accent circle behind the icon */
        .selected .icon-container {
                background-color: var(--accent-opacity);   /* subtle tinted circle */
        }

        button:hover {
                transform: scale(1.1);
        }

        /* Mobile adjustments – slightly smaller touch targets */
        @media screen and (max-width: 868px) {
                .icon-container {
                        width: 34px;
                        height: 34px;
                }
        }
</style>