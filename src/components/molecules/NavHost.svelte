<script lang="ts">
        import Nav from '../atoms/Nav.svelte';
        import { createEventDispatcher } from 'svelte';
        
        let y: number;
        const dispatch = createEventDispatcher();
        
        function openMuseum() {
                dispatch('museum');
        }
</script>

<nav>
        <div class="nav-container" class:scrolled={y > 20}>
                <ul>
                        <Nav href="#home" section="/" isSelected={y < 500}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--accent)" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        </Nav>
                        <Nav href="#fragments" section="fragments" isSelected={y > 500 && y < 1500}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--accent)"><path d="M440-91 160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm0-366v274l40 23 40-23v-274l240-139v-42l-43-25-237 137-237-137-43 25v42l240 139Z"/></svg>
                        </Nav>
                        <Nav href="#books" section="books" isSelected={y > 1500 && y < 2500}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--accent)" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8V9zm0 3h4v2h-4v-2zm0-6h8v2h-8V6z"/></svg>
                        </Nav>
                        <Nav href="#signature-wall" section="museum" isSelected={y > 2500} on:click={openMuseum}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--accent)"><path d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h160l160-160 160 160h160q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H160Zm80-160h480L570-440 450-280l-90-120-120 160Zm502.5-217.5Q760-475 760-500t-17.5-42.5Q725-560 700-560t-42.5 17.5Q640-525 640-500t17.5 42.5Q675-440 700-440t42.5-17.5ZM404-720h152l-76-76-76 76Z"/></svg>
                        </Nav>
                </ul>
        </div>
</nav>

<svelte:window bind:scrollY={y} />

<style lang="scss">
        nav {
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 1rem;
                left: 0;
                right: 0;
                z-index: 15;
        }
        .nav-container {
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--elevation-one);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 50px;
                padding: 0.5rem 1.5rem;
                transition: all 0.4s ease;
                
                ul {
                        display: flex;
                        gap: 0.25rem;
                        justify-content: center;
                        margin: 0;
                        padding: 0;
                }
        }
        .scrolled {
                background: var(--elevation-two);
                box-shadow: 0 4px 24px rgba(0,0,0,0.3);
                border-color: rgba(255,255,255,0.12);
        }
        @media (min-width: 868px) {
                .nav-container {
                        border-radius: 50px;
                        padding: 0.5rem 2rem;
                }
        }
        @media (max-width: 868px) {
                nav {
                        top: auto;
                        bottom: 0.75rem;
                }
                .nav-container {
                        border-radius: 40px;
                        padding: 0.4rem 0.75rem;
                        ul {
                                gap: 0;
                                justify-content: space-evenly;
                        }
                }
        }
</style>