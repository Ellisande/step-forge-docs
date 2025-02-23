// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from "@tailwindcss/vite";


// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
	integrations: [
		starlight({
			title: 'Step Forge Docs',
			social: {
				github: 'https://github.com/ellisande/step-forge',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						// We don't use autogenerate because order matters.
						{ label: 'Installing Step Forge', slug: 'guides/installing' },
						{ label: 'Setting Up Cucumber', slug: 'guides/setting-up-cucumber' },
						{ label: 'Write a Feature', slug: 'guides/write-a-feature' },
						{ label: 'Define Steps', slug: 'guides/define-steps' },
					],
				},
				{
					label: 'Concepts',
					autogenerate: { directory: 'concepts' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: "VS Code Extension",
					autogenerate: { directory: 'vscode' },
				}
			],
		}),
	],
});
