
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				game: {
					dark: '#0A1128',
					darker: '#060A16',
					accent: '#D946EF',
					highlight: '#0EA5E9',
					text: '#F0F4F8',
					muted: '#8B5CF6'
				},
				sunset: {
					dark: '#2F2E33',
					purple: '#5B3C80',
					'purple-light': '#744C9E',
					red: '#FE5F55',
					green: '#BCD8C1',
					white: '#F0EBF4',
					grey: '#A3A1A8'
				},
				// Batman theme colors - expanded
				batman: {
					dark: '#1A1F2C',
					black: '#000000e6',
					'dark-accent': '#0006',
					gray: '#2226',
					gold: '#FFC700',
					yellow: '#FFC700',
					accent: '#FFC700',
					gray: {
						DEFAULT: '#333333',
						light: '#555555',
						dark: '#222222',
					},
				},
				// Superman theme colors - expanded
				superman: {
					red: '#ea384c',
					blue: '#0A3161',
					'blue-light': '#1EAEDB',
					yellow: '#FEF7CD',
					accent: '#ea384c',
				},
				// Starfire theme colors - expanded
				starfire: {
					purple: '#2D1B69',
					'purple-light': '#9b87f5',
					magenta: '#D946EF',
					accent: '#D946EF',
				}
			},
			fontFamily: {
				mono: ['Consolas', 'Monaco', 'Liberation Mono', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'text-appear': {
					'0%': { opacity: '0', transform: 'translateY(4px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'text-appear': 'text-appear 0.3s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
