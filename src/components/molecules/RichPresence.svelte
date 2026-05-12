<script lang="ts">
    import { onMount } from 'svelte';
    import Tooltip from '../atoms/Tooltip.svelte';

    let activity = '@9cr';
    let details = 'Offline';
    let activityImage = '/default.webp'; // Replace with your image path
    let state: string;
    let smallImage: string = '';
    let isSpotify: boolean = false;
    let isActivity: boolean = false;
    let currentSetInterval: ReturnType<typeof setInterval>;

    function localTime() {
        state = new Date().toLocaleTimeString('en-US', { 
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
    }

    localTime();
    currentSetInterval = setInterval(() => localTime(), 1000);

    onMount(() => {
        return () => {
            clearInterval(currentSetInterval);
        };
    });
</script>

<h2>activity</h2>
<div class="contain">
    <img src={activityImage} alt={activity} class="big" class:spin={isSpotify} />
    {#if smallImage}
        <img src={smallImage} alt={activity} class="small" />
    {/if}
    <div>
        <h3>{activity}</h3>
        <h5>{details}</h5>
        <h5>{state || ''}</h5>
    </div>
</div>

<style lang="scss">
    .contain {
        display: flex;
        gap: 2.25rem;
        align-items: center;
    }

    h2 {
        display: none;
    }

    .big {
        height: 135px;
        width: 135px;
        border-radius: 20px;
        display: relative;
        user-select: none;
        transition: all 0.3s var(--bezier-one);
    }

    .small {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        position: absolute;
        transform: translate(275%, 150%);
        outline: 6px solid var(--bg-color);
        background-color: var(--bg-color);
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .spin {
        animation: rotate 40s linear infinite;
        border-radius: 50%;
    }

    @media screen and (max-width: 868px) {
        h2 {
            display: block;
            margin-bottom: 1rem;
        }
        div {
            justify-content: left;
        }

        .big {
            height: 100px;
            width: 100px;
            border-radius: 17px;
        }

        .spin {
            border-radius: 50%;
        }

        .small {
            transform: translate(190%, 110%);
        }
    }
</style>