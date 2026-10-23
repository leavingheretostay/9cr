import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const expectedPassword = env.COMMENT_DELETE_PASSWORD;
	const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
	const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL;

	// Fail closed until the server-only secrets are configured.
	if (!expectedPassword || !serviceRoleKey || !supabaseUrl) {
		return json({ error: 'Comment deletion is not configured.' }, { status: 503 });
	}

	let body: {
		password?: unknown;
		poemIndex?: unknown;
		commentName?: unknown;
		commentText?: unknown;
		createdAt?: unknown;
	};

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request.' }, { status: 400 });
	}

	if (
		typeof body.password !== 'string' ||
		body.password !== expectedPassword ||
		!Number.isInteger(body.poemIndex) ||
		typeof body.commentName !== 'string' ||
		typeof body.commentText !== 'string' ||
		typeof body.createdAt !== 'string'
	) {
		return json({ error: 'Invalid credentials or comment details.' }, { status: 401 });
	}

	const admin = createClient(supabaseUrl, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
	const { error } = await admin
		.from('poem_comments')
		.delete()
		.eq('poem_index', body.poemIndex as number)
		.eq('comment_name', body.commentName)
		.eq('comment_text', body.commentText)
		.eq('created_at', body.createdAt);

	if (error) {
		return json({ error: 'Could not delete the comment.' }, { status: 500 });
	}

	return json({ success: true });
};
