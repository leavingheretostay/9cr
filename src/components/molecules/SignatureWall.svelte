<script lang="ts">
        import { createEventDispatcher, onMount } from 'svelte';
        import Tooltip from '../atoms/Tooltip.svelte';
        import type { FooterSignature } from '../../util/types';
        import {
                getSignatureInkOpacity,
                getSignatureOrder,
                getSignatureRotation
        } from '../../util/signatureVisuals';
        import { supabase } from '../../util/supabase';

        export let signatures: FooterSignature[] = [];
        export let loading = false;
        export let errorMessage = '';
        export let supabaseConnected = true;
        export let authWaiting = false;
        export let hideAddButton = false;

        const dispatch = createEventDispatcher<{ open: void }>();

        let signatureGridEl: HTMLDivElement | null = null;
        let gridColumns = 1;
        let currentUser: any = null;

        // Drawing canvas stuff
        let showModal = false;
        let canvasEl: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let isDrawing = false;
        let userName = '';
        let userMessage = '';
        let isSubmitting = false;
        let modalError = '';
        let hasDrawn = false;

        onMount(() => {
                checkUser();
                updateGridColumns();
                const onWindowResize = () => updateGridColumns();
                window.addEventListener('resize', onWindowResize);

                let resizeObserver: ResizeObserver | null = null;
                if (typeof ResizeObserver !== 'undefined') {
                        resizeObserver = new ResizeObserver(() => updateGridColumns());
                        if (signatureGridEl) {
                                resizeObserver.observe(signatureGridEl);
                        }
                }

                return () => {
                        window.removeEventListener('resize', onWindowResize);
                        resizeObserver?.disconnect();
                };
        });

        function initCanvas() {
                if (!canvasEl) return;
                ctx = canvasEl.getContext('2d')!;
                ctx.strokeStyle = 'var(--accent, #ffffff)';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                // Set canvas size
                canvasEl.width = canvasEl.offsetWidth * 2;
                canvasEl.height = canvasEl.offsetHeight * 2;
                ctx.scale(2, 2);
        }

        function startDrawing(e: MouseEvent | TouchEvent) {
                isDrawing = true;
                hasDrawn = true;
                const pos = getPosition(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
        }

        function draw(e: MouseEvent | TouchEvent) {
                if (!isDrawing) return;
                e.preventDefault();
                const pos = getPosition(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
        }

        function stopDrawing() {
                isDrawing = false;
                ctx.closePath();
        }

        function getPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
                const rect = canvasEl.getBoundingClientRect();
                if ('touches' in e) {
                        return {
                                x: e.touches[0].clientX - rect.left,
                                y: e.touches[0].clientY - rect.top
                        };
                }
                return {
                        x: (e as MouseEvent).clientX - rect.left,
                        y: (e as MouseEvent).clientY - rect.top
                };
        }

        function clearCanvas() {
                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                hasDrawn = false;
        }

        function getSignatureData(): string {
                return canvasEl.toDataURL('image/png');
        }

        async function checkUser() {
                if (!supabase) return;
                const { data: { session } } = await supabase.auth.getSession();
                currentUser = session?.user ?? null;
        }

        function updateGridColumns() {
                if (!signatureGridEl || typeof window === 'undefined') return;
                const computed = window.getComputedStyle(signatureGridEl).gridTemplateColumns;
                const columns = computed.split(' ').filter(Boolean).length;
                gridColumns = Math.max(1, columns || 1);
        }

        function getRowStagger(index: number): number {
                if (gridColumns <= 1) return 0;
                const row = Math.floor(index / gridColumns);
                return row % 2 === 1 ? 12 : 0;
        }

        function getSignatureTip(signature: FooterSignature): string {
                const message = signature.message?.trim();
                return message ? `[${signature.name}] ${message}` : signature.name;
        }

        async function handleAddClick() {
                if (!supabase) {
                        openModal();
                        return;
                }

                await checkUser();
                
                if (!currentUser) {
                        authWaiting = true;
                        const redirectTo = window.location.origin + window.location.pathname + '?sign=true';
                        const { error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                        redirectTo,
                                        queryParams: { prompt: 'select_account' }
                                }
                        });
                        if (error) {
                                authWaiting = false;
                                errorMessage = error.message;
                        }
                        return;
                }

                openModal();
        }

        function openModal() {
                showModal = true;
                modalError = '';
                setTimeout(() => initCanvas(), 100);
        }

        function handleClose() {
                showModal = false;
                userName = '';
                userMessage = '';
                modalError = '';
                hasDrawn = false;
        }

        function handleSubmit() {
                if (!userName.trim()) {
                        modalError = 'Please enter your name';
                        return;
                }
                if (!hasDrawn) {
                        modalError = 'Please draw your signature';
                        return;
                }

                isSubmitting = true;
                modalError = '';

                const newSignature: FooterSignature = {
                        id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        name: userName.trim(),
                        message: userMessage.trim(),
                        signature_data: getSignatureData(),
                        created_at: new Date().toISOString()
                };

                signatures = [...signatures, newSignature];
                
                isSubmitting = false;
                handleClose();
        }

        $: shuffledSignatures = [...signatures].sort(
                (a, b) => getSignatureOrder(a.id) - getSignatureOrder(b.id)
        );

        $: if (signatureGridEl) {
                updateGridColumns();
        }
</script>

<section id="signature-wall" class="wrapper signature-wall">
        <div class="signature-header">
                <div>
                        <h3 class="signature-name" aria-label="nasir">
                                <span class="char">n</span><span class="char long">a</span><span class="char">s</span><span
                                        class="char long">i</span
                                ><span class="char">r</span>
                        </h3>
                        <p>Sign my website!</p>
                </div>
                {#if !hideAddButton}
                        <button type="button" class="cta" on:click={handleAddClick} disabled={authWaiting}>
                                {authWaiting ? 'Waiting for login…' : 'Add your signature ↗'}
                        </button>
                {/if}
        </div>

        {#if loading}
                <p class="notice">Loading signatures…</p>
        {:else if signatures.length === 0}
                <p class="notice">No signatures yet :&#123;</p>
        {/if}

        {#if !supabaseConnected}
                <p class="notice error-notice">Supabase is not connected :0</p>
        {/if}

        {#if errorMessage}
                <p class="notice error-notice">{errorMessage}</p>
        {/if}

        <div class="signature-grid" aria-live="polite" bind:this={signatureGridEl}>
                {#each shuffledSignatures as signature, index (signature.id)}
                        <div
                                class="signature-cell"
                                data-signature-id={signature.id ?? ''}
                                style={`--rotation: ${getSignatureRotation(signature.id)}deg; --order: ${getSignatureOrder(signature.id)}; --stagger-x: ${getRowStagger(index)}px`}
                        >
                                <Tooltip tip={getSignatureTip(signature)}>
                                        <button
                                                class="signature-item"
                                                type="button"
                                                id={signature.id ? `signature-${signature.id}` : undefined}
                                                data-signature-id={signature.id ?? ''}
                                                aria-label={`Signature by ${signature.name}`}
                                        >
                                                <span
                                                        class="signature-ink"
                                                        style={`--signature-image: url('${signature.signature_data}'); --ink-opacity: ${getSignatureInkOpacity(signature.id)}`}
                                                        aria-hidden="true"
                                                ></span>
                                        </button>
                                </Tooltip>
                        </div>
                {/each}
        </div>
</section>

{#if showModal}
        <div class="modal-overlay" on:click={handleClose} on:keydown={(e) => e.key === 'Escape' && handleClose()} role="dialog" aria-modal="true" tabindex="-1">
                <div class="modal-content" on:click|stopPropagation>
                        <div class="modal-header">
                                <h3>Sign here ✍️</h3>
                                <button class="close-btn" on:click={handleClose} aria-label="Close">✕</button>
                        </div>

                        <div class="modal-body">
                                <label for="name-input">Your name</label>
                                <input
                                        id="name-input"
                                        type="text"
                                        bind:value={userName}
                                        placeholder="Enter your name"
                                        maxlength="30"
                                />

                                <label for="message-input">Message (optional)</label>
                                <input
                                        id="message-input"
                                        type="text"
                                        bind:value={userMessage}
                                        placeholder="Say something nice..."
                                        maxlength="80"
                                />

                                <label>Draw your signature</label>
                                <div class="canvas-container">
                                        <canvas
                                                bind:this={canvasEl}
                                                class="signature-canvas"
                                                on:mousedown={startDrawing}
                                                on:mousemove={draw}
                                                on:mouseup={stopDrawing}
                                                on:mouseleave={stopDrawing}
                                                on:touchstart={startDrawing}
                                                on:touchmove={draw}
                                                on:touchend={stopDrawing}
                                        ></canvas>
                                        <button class="clear-btn" on:click={clearCanvas}>Clear</button>
                                </div>

                                {#if modalError}
                                        <p class="error">{modalError}</p>
                                {/if}
                        </div>

                        <div class="modal-footer">
                                <button class="cancel-btn" on:click={handleClose}>Cancel</button>
                                <button class="submit-btn" on:click={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Add signature ✦'}
                                </button>
                        </div>
                </div>
        </div>
{/if}

<style lang="scss">
        .signature-wall {
                margin-bottom: 2rem;

                @media (max-width: 768px) {
                        margin-bottom: 1.1rem;
                }
        }

        .signature-header {
                display: flex;
                justify-content: space-between;
                gap: 1.25rem;
                align-items: center;
                margin-bottom: 2rem;

                .signature-name {
                        transform: scaleY(1.3);
                        transform-origin: left bottom;
                        line-height: 1;
                        font-size: clamp(2.35rem, 4vw, 2.8rem);

                        .char {
                                display: inline-block;
                        }
                }

                p {
                        font-size: 0.95rem;
                        line-height: 1.4;
                }

                @media (max-width: 768px) {
                        align-items: stretch;
                        flex-direction: column;
                        gap: 1.25rem;
                        margin-bottom: 1.5rem;

                        p {
                                font-size: 0.82rem;
                        }
                }
        }

        .notice {
                font-size: 0.9rem;
                margin-bottom: 0.75rem;
                color: var(--text-secondary);
        }

        .cta {
                font-family: var(--font-two);
                font-size: 1rem;
                padding: 0.7rem 1.1rem;
                border-radius: 12px;
                border: 1px solid var(--elevation-four);
                background: var(--elevation-one);
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.2s var(--bezier-one);

                &:hover {
                        filter: brightness(108%);
                        transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                        font-size: 0.85rem;
                        padding: 0.5rem 0.75rem;
                        align-self: flex-start;
                }

                &:disabled {
                        opacity: 0.7;
                        cursor: progress;
                        transform: none;
                }
        }

        .signature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                gap: 0.35rem 0.55rem;
                align-items: center;
                min-height: 8.5rem;
                padding-right: 0.75rem;

                @media (max-width: 768px) {
                        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
                        gap: 0.15rem 0.3rem;
                        min-height: 5.5rem;
                        padding-right: 0.45rem;
                }
        }

        .signature-cell {
                order: var(--order);
                display: flex;
                justify-content: center;
                transform: translateX(var(--stagger-x));
        }

        .signature-item {
                position: relative;
                padding: 0;
                margin: 0;
                border: 0;
                background: transparent;
                cursor: pointer;
                transform: rotate(var(--rotation));
                transition: transform 0.18s var(--bezier-one), filter 0.18s var(--bezier-one);
                will-change: transform;

                &:hover {
                        transform: rotate(0deg);
                }
        }

        .signature-ink {
                display: block;
                width: clamp(92px, 15vw, 160px);
                height: 64px;
                background-color: var(--accent);
                -webkit-mask-image: var(--signature-image);
                mask-image: var(--signature-image);
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-position: center;
                mask-position: center;
                -webkit-mask-size: contain;
                mask-size: contain;
                opacity: var(--ink-opacity, 0.82);
                transition: filter 0.18s ease, opacity 0.18s ease;

                .signature-item:hover &,
                .signature-item:focus-visible & {
                        filter: brightness(1.08) saturate(1.2);
                        opacity: 1;
                }

                @media (max-width: 768px) {
                        width: clamp(70px, 20vw, 106px);
                        height: 42px;
                }
        }

        // Modal styles
        .modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 1rem;
        }

        .modal-content {
                background: var(--bg-color, #1a1a1a);
                border: 1px solid var(--elevation-four, #333);
                border-radius: 16px;
                padding: 1.5rem;
                max-width: 460px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.25s var(--bezier-one);
        }

        @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.25rem;

                h3 { margin: 0; font-size: 1.25rem; }
        }

        .close-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                border-radius: 6px;

                &:ho