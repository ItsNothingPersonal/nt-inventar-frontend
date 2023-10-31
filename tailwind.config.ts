import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import { join } from 'path';
import type { Config } from 'tailwindcss';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			screens: {
				print: { raw: 'print' }
			}
		}
	},
	plugins: [
		forms,
		skeleton({
			themes: { preset: [{ name: 'crimson', enhancements: true }] }
		})
	]
} satisfies Config;

export default config;
