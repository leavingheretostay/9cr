<script>
	import Social from '../atoms/Social.svelte';

	import { InstagramIcon } from '@indaco/svelte-iconoir/instagram';
	import { XIcon } from '@indaco/svelte-iconoir/x';
	import { MailIcon } from '@indaco/svelte-iconoir/mail';
	import { CoffeeCupIcon } from '@indaco/svelte-iconoir/coffee-cup';
	import { LinkedInIcon } from '@indaco/svelte-iconoir/linkedin';
</script>

<div class="socials-container">
	<Social tip="@nacirlone" link="https://instagram.com/nacirlone">
		<InstagramIcon color="var(--accent)" />
	</Social>

	<Social tip="Nasir Lone" link="https://linkedin.com">
		<LinkedInIcon color="var(--accent)" />
	</Social>

	<Social tip="@beingkashmire" link="https://twitter.com/beingkashmire">
		<XIcon color="var(--accent)" />
	</Social>

	<Social tip="mail me" link="mailto:lonenasir724@gmail.com">
		<MailIcon color="var(--accent)" />
	</Social>

	<Social tip="bitta" link="#">
		<CoffeeCupIcon color="var(--accent)" />
	</Social>
</div>

<style>
	.socials-container {
		display: flex;
		gap: 0.75rem;
	}
</style>