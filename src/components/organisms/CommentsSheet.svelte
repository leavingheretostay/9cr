<script lang="ts">
        export let comments: { name: string; text: string }[][] = [];
        export let activeSheet: number;
        export let commentNames: string[] = [];
        export let commentInputs: string[] = [];
        export let showDeleteComment: boolean;
        export let deleteCommentTarget: { poem: number; index: number } | null;
        export let deleteCommentPassword: string;
        export let deleteCommentError: string;
        export let longPressTimer: ReturnType<typeof setTimeout> | null;
        export let postComment: (index: number) => void;
        export let confirmDeleteComment: () => void;
        export let closeSheet: () => void;
        export let startDelete: (poem: number, index: number) => void;
</script>

{#if activeSheet >= 0}
        <div class="comments-overlay" on:click={closeSheet}>
                <div class="comments-sheet" on:click|stopPropagation>
                        <div class="sheet-header">
                                <h3>Comments</h3>
                                <!-- Simple cross – no box -->
                                <button class="close-btn" on:click={closeSheet} aria-label="Close">
                                        ✕
                                </button>
                        </div>
                        <div class="sheet-body">
                                {#if comments[activeSheet]?.length > 0}
                                        {#each comments[activeSheet] as comment, i}
                                                <div class="comment-bubble">
                                                        <div class="comment-content">
                                                                <span class="comment-name">{comment.name}</span>
                                                                <p class="comment-text">{comment.text}</p>
                                                        </div>
                                                        <!-- Delete icon – trash can -->
                                                        <button
                                                                class="delete-icon"
                                                                on:click={() => startDelete(activeSheet, i)}
                                                                aria-label="Delete comment"
                                                        >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                </svg>
                                                        </button>
                                                </div>
                                        {/each}
                                {:else}
                                        <p class="no-comments">No comments yet. Be the first!</p>
                                {/if}
                        </div>
                        <div class="sheet-input">
                                <input type="text" bind:value={commentNames[activeSheet]} placeholder="Your name" maxlength="30" class="name-input" />
                                <input type="text" bind:value={commentInputs[activeSheet]} placeholder="Add a comment..." maxlength="200" />
                                <button class="send-btn" on:click={() => postComment(activeSheet)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                        </div>
                </div>
        </div>
{/if}

{#if showDeleteComment}
        <div class="modal-overlay" on:click={() => showDeleteComment = false} role="dialog" aria-modal="true">
                <div class="modal-content" on:click|stopPropagation>
                        <div class="modal-header">
                                <h3>Delete Comment</h3>
                                <button class="close-btn" on:click={() => showDeleteComment = false}>✕</button>
                        </div>
                        <div class="modal-body">
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">Enter password to delete:</p>
                                <input type="password" bind:value={deleteCommentPassword} placeholder="Password" />
                                {#if deleteCommentError}<p class="error">{deleteCommentError}</p>{/if}
                        </div>
                        <div class="modal-footer">
                                <button class="cancel-btn" on:click={() => showDeleteComment = false}>Cancel</button>
                                <button class="delete-btn" on:click={confirmDeleteComment}>Delete</button>
                        </div>
                </div>
        </div>
{/if}

<style lang="scss">
        .comments-overlay {
                position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000;
                display: flex; align-items: flex-end;
        }
        .comments-sheet {
                background: var(--bg-color); border-radius: 20px 20px 0 0;
                width: 100%; max-height: 60vh; display: flex; flex-direction: column;
                animation: slideUpSheet 0.3s ease;
        }
        @keyframes slideUpSheet {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
        }

        .sheet-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sheet-header h3 {
                margin: 0; font-size: 1rem;
        }
        .close-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0.25rem;
                line-height: 1;
                transition: color 0.2s;
                /* no background, no border, no outline on focus */
                &:hover { color: var(--text-primary); }
                &:focus { outline: none; }
        }

        .sheet-body {
                flex: 1; overflow-y: auto; padding: 1rem 1.25rem;
        }

        .comment-bubble {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .comment-content {
                flex: 1;
                min-width: 0;
        }
        .comment-name {
                font-size: 0.75rem; font-weight: 600; color: var(--text-primary);
                display: block; margin-bottom: 0.15rem;
        }
        .comment-text {
                font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.4; opacity: 0.9;
                word-wrap: break-word;
        }
        .delete-icon {
                background: none;
                border: none;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0.15rem;
                border-radius: 4px;
                flex-shrink: 0;
                margin-top: 0.1rem;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover {
                        color: #ef4444;
                        background: rgba(239, 68, 68, 0.1);
                }
        }

        .sheet-input {
                display: flex; gap: 0.4rem; padding: 0.75rem 1rem;
                border-top: 1px solid rgba(255,255,255,0.08); align-items: center;
        }
        .sheet-input input {
                flex: 1; min-width: 60px; padding: 0.55rem 0.75rem; border-radius: 20px;
                border: 1px solid rgba(255,255,255,0.1); background: var(--elevation-one);
                color: var(--text-primary); font-family: inherit; font-size: 0.8rem;
                &:focus { outline: none; border-color: var(--accent); }
        }
        .name-input { max-width: 100px; }
        .send-btn {
                background: var(--accent); border: none; color: white;
                width: 40px; height: 40px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .no-comments {
                font-size: 0.85rem; color: var(--text-secondary); opacity: 0.5;
                text-align: center; padding: 1rem 0;
        }

        /* Delete modal styles (reused from signature wall) */
        .modal-overlay {
                position: fixed; inset: 0; background: rgba(0,0,0,0.7);
                backdrop-filter: blur(4px); z-index: 2000;
                display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-content {
                background: var(--bg-color); border: 1px solid var(--elevation-four);
                border-radius: 16px; padding: 1.5rem; max-width: 460px; width: 100%;
                animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
                display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;
        }
        .modal-header h3 { margin: 0; font-size: 1.25rem; }
        .modal-body {
                display: flex; flex-direction: column; gap: 0.6rem;
        }
        .modal-body input {
                padding: 0.65rem 0.85rem; border-radius: 10px;
                border: 1px solid var(--elevation-four); background: var(--elevation-one);
                color: var(--text-primary); font-family: inherit; font-size: 0.9rem;
                &:focus { outline: none; border-color: var(--accent); }
        }
        .error { color: #ef4444; font-size: 0.8rem; margin: 0; }
        .modal-footer {
                display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;
        }
        .cancel-btn {
                background: var(--elevation-two); border: 1px solid var(--elevation-four);
                color: var(--text-secondary); padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer;
        }
        .delete-btn {
                background: #ef4444; border: none; color: white;
                padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer;
                font-family: var(--font-two);
                &:hover { filter: brightness(1.1); }
        }
</style>