<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Tooltip from '../atoms/Tooltip.svelte';
	import type { FooterSignature } from '../../util/types';
	import {
		getSignatureInkOpacity,
		getSignatureOrder,
		getSignatureRotation
	} from '../../util/signatureVisuals';

	export let signatures: FooterSignature[] = [];
	export let loading = false;
	export let errorMessage = '';
	export let supabaseConnected = true;
	export let authWaiting = false;
	export let hideAddButton = false;

	const dispatch = createEventDispatcher<{ open: void }>();

	let signatureGridEl: HTMLDivElement | null = null;
	let gridColumns = 1;
	let showModal = false;
	let signatureData = '';
	let userName = '';
	let userMessage = '';
	let isSubmitting = false;
	let modalError = '';

	onMount(() => {
		const saved = localStorage.getItem('site-signatures');
		if (saved) {
			try {
				signatures = JSON.parse(saved);
			} catch (e) {
				// ignore
			}
		}
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

	function saveSignatures() {
		localStorage.setItem('site-signatures', JSON.stringify(signatures));
	}

	function handleOpen() {
		showModal = true;
		modalError = '';
	}

	function handleClose() {
		showModal = false;
		signatureData = '';
		userName = '';
		userMessage = '';
		modalError = '';
	}

	function handleSubmit() {
		if (!userName.trim()) {
			modalError = 'Please enter your name';
			return;
		}
		if (!signatureData.trim()) {
			modalError = 'Please paste your signature';
			return;
		}

		isSubmitting = true;
		modalError = '';

		const newSignature: FooterSignature = {
			id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			name: userName.trim(),
			message: userMessage.trim(),
			signature_data: signatureData.trim(),
			created_at: new Date().toISOString()
		};

		signatures = [...signatures, newSignature];
		saveSignatures();
		
		isSubmitting = false;
		handleClose();
	}

	function handlePaste(e: ClipboardEvent) {
		const items = e.clipboardData?.items;
		if (items) {
			for (let i = 0; i < items.length; i++) {
				if (items[i].type.startsWith('image/')) {
					const blob = items[i].getAsFile();
					if (blob) {
						const reader = new FileReader();
						reader.onload = (event) => {
							signatureData = event.target?.result as string;
						};
						reader.readAsDataURL(blob);
					}
				}
			}
		}
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
			<button type="button" class="cta" on:click={handleOpen}>
				Add your signature &#8599;
			</button>
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
				<h3>Add your signature</h3>
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

				<label for="signature-area">Your signature</label>
				<div 
					class="paste-area" 
					on:paste={handlePaste}
					tabindex="0"
				>
					{#if signatureData}
						<img src={signatureData} alt="Your signature preview" class="sig-preview" />
						<button class="clear-sig" on:click={() => signatureData = ''}>Remove</button>
					{/if}
					<textarea
						id="signature-area"
						bind:value={signatureData}
						placeholder="Paste your signature image here (Ctrl+V) or paste an image URL..."
						rows="4"
					></textarea>
					{#if !signatureData}
						<p class="paste-hint">💡 Copy your signature image then press Ctrl+V here</p>
					{/if}
				</div>

				{#if modalError}
					<p class="error">{modalError}</p>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="cancel-btn" on:click={handleClose}>Cancel</button>
				<button class="submit-btn" on:click={handleSubmit} disabled={isSubmitting}>
					{isSubmitting ? 'Adding...' : 'Add signature ✦'}
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
		transition:
			transform 0.18s var(--bezier-one),
			filter 0.18s var(--bezier-one);
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
		transition:
			filter 0.18s ease,
			opacity 0.18s ease;

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
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;

		h3 {
			margin: 0;
			font-size: 1.25rem;
		}
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;

		&:hover {
			background: var(--elevation-two);
			color: var(--text-primary);
		}
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;

		label {
			font-size: 0.85rem;
			font-weight: 500;
			color: var(--text-secondary);
			margin-top: 0.5rem;
		}

		input, textarea {
			padding: 0.65rem 0.85rem;
			border-radius: 10px;
			border: 1px solid var(--elevation-four);
			background: var(--elevation-one);
			color: var(--text-primary);
			font-family: inherit;
			font-size: 0.9rem;
			resize: vertical;

			&:focus {
				outline: none;
				border-color: var(--accent);
			}
		}
	}

	.paste-area {
		position: relative;
		border: 2px dashed var(--elevation-four);
		border-radius: 12px;
		padding: 1rem;
		text-align: center;
		min-height: 80px;

		&:focus-within {
			border-color: var(--accent);
		}

		textarea {
			width: 100%;
			border: none;
			background: transparent;
			padding: 0.5rem;
			margin-top: 0.25rem;
		}

		.paste-hint {
			font-size: 0.75rem;
			color: var(--text-secondary);
			margin-top: 0.5rem;
		}
	}

	.sig-preview {
		max-height: 100px;
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}

	.clear-sig {
		background: var(--elevation-two);
		border: none;
		color: var(--text-secondary);
		font-size: 0.75rem;
		padding: 0.3rem 0.7rem;
		border-radius: 6px;
		cursor: pointer;
		margin-bottom: 0.5rem;

		&:hover {
			color: #ef4444;
		}
	}

	.error {
		color: #ef4444;
		font-size: 0.8rem;
		margin: 0;
	}

	.modal-footer {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-top: 1.5rem;

		button {
			font-family: var(--font-two);
			font-size: 0.9rem;
			padding: 0.6rem 1.2rem;
			border-radius: 10px;
			cursor: pointer;
		}
	}

	.cancel-btn {
		background: var(--elevation-two);
		border: 1px solid var(--elevation-four);
		color: var(--text-secondary);

		&:hover {
			color: var(--text-primary);
		}
	}

	.submit-btn {
		background: var(--accent);
		border: none;
		color: white;

		&:hover {
			filter: brightness(1.1);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	@media (max-width: 500px) {
		.modal-content {
			padding: 1.25rem;
			border-radius: 14px;
		}
	}
</style>