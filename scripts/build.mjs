// Cloudflare injects NODE_OPTIONS=--use-openssl-ca, which Node workers reject.
// Remove that inherited option before starting Vite/SvelteKit build workers.
delete process.env.NODE_OPTIONS;

const { build } = await import('vite');
await build();
