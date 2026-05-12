<script lang="ts">
	import { onMount } from 'svelte';
	import SignatureWall from './SignatureWall.svelte';
	import type { FooterSignature } from '../../util/types';

	let showModal = false;
	let signatureData = '';
	let userName = '';
	let userMessage = '';
	let signatures: FooterSignature[] = [];
	let isSubmitting = false;
	let errorMessage = '';

	// Load existing signatures from localStorage
	onMount(() => {
		const saved = localStorage.getItem('site-signatures');
		if (saved) {
			try {
				signatures = JSON.parse(saved);
			} catch (e) {
				// ignore
			}
		}
	});

	function saveSignatures() {
		localStorage.setItem('site-signatures', JSON.stringify(signatures));
	}

	function handleOpen() {
		showModal = true;
		errorMessage = '';
	}

	function handleClose() {
		showModal = false;
		signatureData = '';
		userName = '';
		userMessage = '';
		errorMessage = '';
	}

	function handleSubmit() {
		if (!userName.trim()) {
			errorMessage = 'Please enter your name';
			return;
		}
		if (!signatureData.trim()) {
			errorMessage = 'Please paste your signature';
			return;
		}

		isSubmitting = true;
		errorMessage = '';

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
</script>

<SignatureWall 
	{signatures} 
	on:open={handleOpen}
	hideAddButton={false}
/>

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
						placeholder="Paste your signature image here (Ctrl+V / Cmd+V) or paste an image URL..."
						rows="4"
					></textarea>
					{#if !signatureData}
						<p class="paste-hint">💡 Tip: Copy your signature image then press Ctrl+V here</p>
					{/if}
				</div>

				{#if errorMessage}
					<p class="error">{errorMessage}</p>
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
		transition: all 0.2s;

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
			transition: border-color 0.2s;

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
		transition: border-color 0.2s;
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
			transition: all 0.2s var(--bezier-one);
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