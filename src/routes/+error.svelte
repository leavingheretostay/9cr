<script>
        import { page } from '$app/stores';
</script>

<svelte:head>
        <title>lost — 9cr</title>
</svelte:head>

<div class="error-page">
        <div class="error-content">
                <h1 class="error-code">404</h1>
                <div class="divider"></div>
                <p class="error-quote">
                        "Not all those who wander are lost."
                </p>
                <span class="error-author">— J.R.R. Tolkien</span>
                <p class="error-message">
                        But this page definitely is. It doesn't exist or has been moved.
                </p>
                <a href="/" class="home-link">Take me home →</a>
        </div>
        
        <div class="particles-bg"></div>
</div>

<style>
        .error-page {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 80vh;
                padding: 2rem;
                text-align: center;
                position: relative;
        }

        .error-content {
                position: relative;
                z-index: 1;
                max-width: 500px;
        }

        .error-code {
                font-size: 8rem;
                font-weight: 700;
                color: var(--accent);
                margin: 0;
                line-height: 1;
                letter-spacing: -0.05em;
                opacity: 0.8;
        }

        .divider {
                width: 60px;
                height: 2px;
                background: var(--accent);
                margin: 2rem auto;
                opacity: 0.5;
        }

        .error-quote {
                font-size: 1.3rem;
                color: var(--text-primary);
                font-style: italic;
                line-height: 1.8;
                margin-bottom: 0.5rem;
        }

        .error-author {
                font-size: 0.9rem;
                color: var(--text-secondary);
                opacity: 0.7;
                display: block;
                margin-bottom: 2rem;
        }

        .error-message {
                font-size: 1rem;
                color: var(--text-secondary);
                opacity: 0.8;
                line-height: 1.6;
                margin-bottom: 2.5rem;
        }

        .home-link {
                display: inline-block;
                padding: 0.75rem 2rem;
                background: var(--accent);
                color: white;
                text-decoration: none;
                border-radius: 12px;
                font-size: 1rem;
                font-family: var(--font-two);
                transition: all 0.3s;
        }

        .home-link:hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
        }

        @media (max-width: 600px) {
                .error-code {
                        font-size: 5rem;
                }
                .error-quote {
                        font-size: 1.1rem;
                }
        }
</style>