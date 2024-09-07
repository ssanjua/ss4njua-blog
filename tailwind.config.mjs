/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
	return ({ opacityValue }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`;
		}
		return `rgb(var(${variableName}))`;
	};
}

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			textColor: {
				skin: {
					base: withOpacity("--color-text-base"),
					accent: withOpacity("--color-text-accent"),
				},
			},
			backgroundColor: {
				skin: {
					fill: withOpacity("--color-fill"),
					card: withOpacity("--color-card"),
					accent: withOpacity("--color-accent"),
					"card-muted": withOpacity("--color-card-muted"),
					inverted: withOpacity("--color-text-base"),
				},
			},
			fontFamily: {
				mono: ["Source Code Pro", "monospace"],
				inter: ["Inter", "sans-serif"],
			},
			borderColor: {
				skin: {
					line: withOpacity("--color-border"),
					accent: withOpacity("--color-border-accent"),
					fill: withOpacity("--color-text-base"),
				},
			},
			boxShadow: {
				custom: 'var(--shadow-custom)',
				accent: 'var(--shadow-custom-accent)',
			},
			fill: {
				skin: {
					base: withOpacity("--color-text-base"),
					accent: withOpacity("--color-text-accent"),
				},
			},
			outlineColor: {
        skin: {
          fill: withOpacity("--color-accent"),
        },
      },
		},
	},
	plugins: [require("@tailwindcss/typography")],
};