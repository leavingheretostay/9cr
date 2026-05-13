<script lang="ts">
        import { onMount } from 'svelte';
        import Tooltip from '../atoms/Tooltip.svelte';
        import type { FooterSignature } from '../../util/types';
        import {
                getSignatureInkOpacity,
                getSignatureOrder,
                getSignatureRotation
        } from '../../util/signatureVisuals';
        import { supabase } from '../../util/supabase';

        export let signatures: FooterSignature[] = [];
        export let hideAddButton = false;
        export let loading = false;

        let signatureGridEl: HTMLDivElement | null = null;
        let gridColumns = 1;

        // Modal
        let showModal = false;
        let canvasEl: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let isDrawing = false;
        let userName = '';
        let userMessage = '';
        let hasDrawn = false;
        let modalError = '';
        let isSubmitting = false;

        // Delete
        let deleteTarget: string | null = null;
        let showDeleteConfirm = false;
        let deletePassword = '';
        let deleteError = '';
        let longPressTimer: ReturnType<typeof setTimeout> | null = null;

        onMount(() => {
                // Clear old localStorage signatures permanently
                localStorage.removeItem('site-signatures');
                
                loadSignatures();
                updateGridColumns();
                window.addEventListener('resize', updateGridColumns);
                return () => window.removeEventListener('resize', updateGridColumns);
        });

        async function loadSignatures() {
                if (!supabase) return;
                loading = true;
                const { data, error } = await supabase
                        .from('footer_signatures')
                        .select('*')
                        .order('created_at', { ascending: false });
                if (!error && data) {
                        signatures = data.map((sig: any) => ({
                                ...sig,
                                signature_data: sig.signature_data?.replace('http://', 'https://')
                        })) as FooterSignature[];
                }
                loading = false;
        }

        function initCanvas() {
                if (!canvasEl) return;
                ctx = canvasEl.getContext('2d')!;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                const rect = canvasEl.getBoundingClientRect();
                canvasEl.width = rect.width * 2;
                canvasEl.height = rect.height * 2;
                ctx.scale(2, 2);
        }

        function startDrawing(e: MouseEvent | TouchEvent) {
                isDrawing = true;
                hasDrawn = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
        }

        function draw(e: MouseEvent | TouchEvent) {
                if (!isDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
        }

        function stopDrawing() { isDrawing = false; }

        function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
                const rect = canvasEl.getBoundingClientRect();
                if ('touches' in e) {
                        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
                }
                return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
        }

        function clearCanvas() {
                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                hasDrawn = false;
        }

        function handleOpen() {
                showModal = true;
                modalError = '';
                setTimeout(() => initCanvas(), 200);
        }

        function handleClose() {
                showModal = false;
                userName = '';
                userMessage = '';
                hasDrawn = false;
                modalError = '';
        }

        async function handleSubmit() {
                if (!userName.trim()) { modalError = 'Please enter your name'; return; }
                if (!hasDrawn) { modalError = 'Please draw your signature'; return; }
                if (!supabase) { modalError = 'Database not connected'; return; }

                isSubmitting = true;
                modalError = '';

                const newSig = {
                        id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        name: userName.trim(),
                        message: userMessage.trim(),
                        signature_data: canvasEl.toDataURL('image/png'),
                        created_at: new Date().toISOString()
                };

                const { error } = await supabase
                        .from('footer_signatures')
                        .insert([newSig]);

                if (error) {
                        modalError = 'Failed to save. Try again.';
                } else {
                        signatures = [newSig, ...signatures];
                        handleClose();
                }
                isSubmitting = false;
        }

        // Long press for delete
        function startLongPress(sigId: string) {
                longPressTimer = setTimeout(() => {
                        deleteTarget = sigId;
                        showDeleteConfirm = true;
                        deletePassword = '';
                        deleteError = '';
                }, 800);
        }

        function cancelLongPress() {
                if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                }
        }

        async function confirmDelete() {
                if (deletePassword !== '9cr2026') {
                        deleteError = 'Wrong password';
                        return;
                }
                if (!supabase || !deleteTarget) return;

                const { error } = await supabase
                        .from('footer_signatures')
                        .delete()
                        .eq('id', deleteTarget);

                if (!error) {
                        signatures = signatures.filter(s => s.id !== deleteTarget);
                        showDeleteConfirm = false;
                        deleteTarget = null;
                } else {
                        deleteError = 'Failed to delete';
                }
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

        $: shuffledSignatures = [...signatures].sort((a, b) => getSignatureOrder(a.id) - getSignatureOrder(b.id));
</script>

<section id="signature-wall" class="wrapper signature-wall">
        <div class="signature-header">
                <div>
                        <h3 class="signature-name" aria-label="nasir">
                                <span class="char">n</span><span class="char long">a</span><span class="char">s</span><span class="char long">i</span><span class="char">r</span>
                        </h3>
                        <p>Sign my website!</p>
                </div>
                {#if !hideAddButton}
                        <button type="button" class="cta" on:click={handleOpen}>Add your signature &#8599;</button>
                {/if}
        </div>

        {#if loading}
                <p class="notice">Loading signatures…</p>
        {:else if signatures.length === 0}
                <p class="notice">No signatures yet :&#123;</p>
        {/if}

        <div class="signature-grid" aria-live="polite" bind:this={signatureGridEl}>
                {#each shuffledSignatures as signature, index (signature.id)}
                        <div
                                class="signature-cell"
                                style="--rotation: {getSignatureRotation(signature.id)}deg; --order: {getSignatureOrder(signature.id)}; --stagger-x: {getRowStagger(index)}px"
                        >
                                <Tooltip tip={getSignatureTip(signature)}>
                                        <button
                                                class="signature-item"
                                                type="button"
                                                aria-label="Signature by {signature.name}"
                                                on:touchstart={() => startLongPress(signature.id)}
                                                on:touchend={cancelLongPress}
                                                on:touchmove={cancelLongPress}
                                                on:mousedown={() => startLongPress(signature.id)}
                                                on:mouseup={cancelLongPress}
                                                on:mouseleave={cancelLongPress}
                                        >
                                                <span
                                                        class="signature-ink"
                                                        style="--signature-image: url('{signature.signature_data}'); --ink-opacity: {getSignatureInkOpacity(signature.id)}"
                                                ></span>
                                        </button>
                                </Tooltip>
                        </div>
                {/each}
        </div>
</section>

<!-- Add Signature Modal -->
{#if showModal}
        <div class="modal-overlay" on:click={handleClose} role="dialog" aria-modal="true">
                <div class="modal-content" on:click|stopPropagation>
                        <div class="modal-header">
                                <h3>Sign here ✍️</h3>
                                <button class="close-btn" on:click={handleClose}>✕</button>
                        </div>
                        <div class="modal-body">
                                <label for="name-input">Your name</label>
                                <input id="name-input" type="text" bind:value={userName} placeholder="Enter your name" maxlength="30" />
                                <label for="message-input">Message (optional)</label>
                                <input id="message-input" type="text" bind:value={userMessage} placeholder="Say something nice..." maxlength="80" />
                                <label>Draw your signature</label>
                                <div class="canvas-container">
                                        <canvas bind:this={canvasEl} class="signature-canvas"
                                                on:mousedown={startDrawing} on:mousemove={draw} on:mouseup={stopDrawing} on:mouseleave={stopDrawing}
                                                on:touchstart={startDrawing} on:touchmove={draw} on:touchend={stopDrawing}></canvas>
                                        <button class="clear-btn" on:click={clearCanvas}>Clear</button>
                                </div>
                                {#if modalError}<p class="error">{modalError}</p>{/if}
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

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
        <div class="modal-overlay" on:click={() => showDeleteConfirm = false} role="dialog" aria-modal="true">
                <div class="modal-content" on:click|stopPropagation>
                        <div class="modal-header">
                                <h3>Delete Signature</h3>
                                <button class="close-btn" on:click={() => showDeleteConfirm = false}>✕</button>
                        </div>
                        <div class="modal-body">
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">Enter password to delete:</p>
                                <input type="password" bind:value={deletePassword} placeholder="Password" />
                                {#if deleteError}<p class="error">{deleteError}</p>{/if}
                        </div>
                        <div class="modal-footer">
                                <button class="cancel-btn" on:click={() => showDeleteConfirm = false}>Cancel</button>
                                <button class="delete-btn" on:click={confirmDelete}>Delete</button>
                        </div>
                </div>
        </div>
{/if}

<style lang="scss">
        .signature-wall { margin-bottom: 2rem; @media (max-width: 768px) { margin-bottom: 1.1rem; } }
        .signature-header {
                display: flex; justify-content: space-between; gap: 1.25rem; align-items: center; margin-bottom: 2rem;
                .signature-name { transform: scaleY(1.3); transform-origin: left bottom; line-height: 1; font-size: clamp(2.35rem, 4vw, 2.8rem); .char { display: inline-block; } }
                p { font-size: 0.95rem; }
                @media (max-width: 768px) { flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; p { font-size: 0.82rem; } }
        }
        .notice { font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-secondary); }
        .cta {
                font-family: var(--font-two); font-size: 1rem; padding: 0.7rem 1.1rem; border-radius: 12px; border: 1px solid var(--elevation-four); background: var(--elevation-one); color: var(--text-primary); cursor: pointer; transition: all 0.2s var(--bezier-one);
                &:hover { filter: brightness(108%); transform: translateY(-1px); }
                @media (max-width: 768px) { font-size: 0.85rem; padding: 0.5rem 0.75rem; }
        }
        .signature-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.35rem 0.55rem; align-items: center; min-height: 8.5rem; padding-right: 0.75rem;
                @media (max-width: 768px) { grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 0.15rem 0.3rem; min-height: 5.5rem; padding-right: 0.45rem; }
        }
        .signature-cell { order: var(--order); display: flex; justify-content: center; transform: translateX(var(--stagger-x)); }
        .signature-item {
                position: relative; padding: 0; margin: 0; border: 0; background: transparent; cursor: pointer; transform: rotate(var(--rotation)); transition: transform 0.18s var(--bezier-one), filter 0.18s var(--bezier-one); will-change: transform;
                &:hover { transform: rotate(0deg); }
        }
        .signature-ink {
                display: block; width: clamp(92px, 15vw, 160px); height: 64px;
                background-color: var(--accent);
                -webkit-mask-image: var(--signature-image); mask-image: var(--signature-image);
                -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
                -webkit-mask-position: center; mask-position: center;
                -webkit-mask-size: contain; mask-size: contain;
                opacity: var(--ink-opacity, 0.82);
                transition: filter 0.18s ease, opacity 0.18s ease;
                .signature-item:hover &, .signature-item:focus-visible & { filter: brightness(1.08) saturate(1.2); opacity: 1; }
                @media (max-width: 768px) { width: clamp(70px, 20vw, 106px); height: 42px; }
        }

        // Modal
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
        .modal-content { background: var(--bg-color); border: 1px solid var(--elevation-four); border-radius: 16px; padding: 1.5rem; max-width: 460px; width: 100%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.25s var(--bezier-one); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; h3 { margin: 0; font-size: 1.25rem; } }
        .close-btn { background: none; border: none; color: var(--text-secondary); font-size: 1.25rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; &:hover { background: var(--elevation-two); color: var(--text-primary); } }
        .modal-body { display: flex; flex-direction: column; gap: 0.6rem;
                label { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); margin-top: 0.5rem; }
                input { padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--elevation-four); background: var(--elevation-one); color: var(--text-primary); font-family: inherit; font-size: 0.9rem; &:focus { outline: none; border-color: var(--accent); } }
        }
        .canvas-container { position: relative; border: 2px dashed var(--elevation-four); border-radius: 12px; overflow: hidden; background: var(--elevation-one); }
        .signature-canvas { width: 100%; height: 180px; cursor: crosshair; touch-action: none; display: block; @media (max-width: 500px) { height: 140px; } }
        .clear-btn { position: absolute; bottom: 8px; right: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: var(--text-secondary); font-size: 0.7rem; padding: 0.3rem 0.7rem; border-radius: 6px; cursor: pointer; &:hover { color: var(--text-primary); } }
        .error { color: #ef4444; font-size: 0.8rem; margin: 0; }
        .modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; button { font-family: var(--font-two); font-size: 0.9rem; padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer; } }
        .cancel-btn { background: var(--elevation-two); border: 1px solid var(--elevation-four); color: var(--text-secondary); &:hover { color: var(--text-primary); } }
        .submit-btn { background: var(--accent); border: none; color: white; &:hover { filter: brightness(1.1); }
                &:disabled { opacity: 0.6; cursor: not-allowed; } }
        .delete-btn { background: #ef4444; border: none; color: white; &:hover { filter: brightness(1.1); } }
</style>