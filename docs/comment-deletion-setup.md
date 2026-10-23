# Secure comment deletion setup

The comment deletion endpoint intentionally fails closed until these server-side environment variables are configured in the deployment environment:

- `COMMENT_DELETE_PASSWORD`: choose a new, unique admin password. Do not reuse the old client-side password.
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase project's service-role key. This is a secret and must never use a `PUBLIC_*` prefix or be placed in client-side code.
- `PUBLIC_SUPABASE_URL`: the existing Supabase project URL.

For Cloudflare Pages, add them under the project's **Settings → Variables and Secrets** for the production environment (and preview environment if you want deletion to work in previews). Mark the password and service-role key as secrets. Redeploy after saving.

The service-role key bypasses Supabase Row Level Security, so keep it server-only and rotate it immediately if it has ever been exposed. The endpoint uses the server-side password check and matches a comment by poem index, name, text, and creation timestamp. If the required variables are missing, deletion returns a configuration error instead of falling back to unsafe browser-side deletion.

Before deploying, verify the table has a `created_at` column (the current app already orders comments by that column) and confirm the deployment adapter supports SvelteKit server routes.
