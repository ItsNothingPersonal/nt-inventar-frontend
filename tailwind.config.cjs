/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				print: { raw: 'print' }
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		styled: true,
		themes: ['cupcake', 'dark', 'cmyk'],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: 'dark'
	}
};
