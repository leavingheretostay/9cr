<section id="books" class="books wrapper">
        <h2>bookshelf</h2>
        <p class="books-subtitle">A few favourites. Free downloads coming soon.</p>
        <div class="book-grid">
                <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=Love+Her+Wild+Atticus', '_blank')} role="button" tabindex="0"><div class="book-cover"><img src="https://i.postimg.cc/GtrvxGrN/71id-Mby-Wp-OL.jpg" alt="Love Her Wild" /></div><div class="book-info"><h3>Love Her Wild</h3><span class="author">Atticus</span><span class="tag">Poetry</span></div></div>
                <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=The+Alchemist+Paulo+Coelho', '_blank')} role="button" tabindex="0"><div class="book-cover"><img src="https://i.postimg.cc/SR0gFn4v/images.jpg" alt="The Alchemist" /></div><div class="book-info"><h3>The Alchemist</h3><span class="author">Paulo Coelho</span><span class="tag">Fiction</span></div></div>
                <div class="book" on:click={() => window.open('https://www.amazon.com/s?k=You+Are+The+Best+Wife+Ajay+K+Pandey', '_blank')} role="button" tabindex="0"><div class="book-cover"><img src="https://i.postimg.cc/5ycsdXJK/you-are-the-best-wife.jpg" alt="You Are The Best Wife" /></div><div class="book-info"><h3>You Are The Best Wife</h3><span class="author">Ajay K. Pandey</span><span class="tag">Fiction</span></div></div>
        </div>
</section>

<style lang="scss">
        .books { margin-top: 5rem; width: 100%; max-width: 700px; } .books h2 { font-size: 2rem; margin-bottom: 0.5rem; } .books-subtitle { font-size: 0.9rem; color: var(--text-secondary); opacity: 0.7; margin-top: 0; margin-bottom: 2rem; } .book-grid { display: flex; flex-direction: column; gap: 1rem; }
        .book { cursor: pointer; display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; background: var(--elevation-one); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.04); transition: all 0.3s; } .book:hover { background: var(--elevation-two); border-color: var(--accent-opacity); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .book-cover { width: 48px; height: 70px; border-radius: 6px; overflow: hidden; flex-shrink: 0; } .book-cover img { width: 100%; height: 100%; object-fit: cover; } .book-info { display: flex; flex-direction: column; gap: 0.2rem; } .book-info h3 { font-size: 1rem; margin: 0; color: var(--text-primary); font-weight: 500; } .book-info .author { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.85; } .book-info .tag { font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0.1rem; color: var(--text-secondary); }
        @media (max-width: 600px) { .book { padding: 1rem; gap: 1rem; } .book-cover { width: 42px; height: 60px; } }
</style>