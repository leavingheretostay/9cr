<style lang="scss">
        /* ... keep everything else, change .icon-container size */
        .icon-container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;    /* up from 40px for a bit more breathing room */
                height: 42px;
                border-radius: 50%;
                transition: background-color 0.3s var(--bezier-one);
        }
        @media screen and (max-width: 868px) {
                .icon-container {
                        width: 38px;
                        height: 38px;
                }
        }
</style>