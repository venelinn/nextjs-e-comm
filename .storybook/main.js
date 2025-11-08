// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url"
/** @type { import('@storybook/nextjs').StorybookConfig } */

import dotenv from "dotenv"
import path, { dirname } from "path"
import webpack from "webpack"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const config = {
	stories: [
		"../components/**/*.mdx",
		"../components/**/*.stories.@(js|jsx|ts|tsx)",
	],

	addons: [
		"@storybook/addon-links",
		"@chromatic-com/storybook",
		"@storybook/addon-docs",
	],

	framework: {
		name: "@storybook/nextjs",
		options: {
			nextConfigPath: path.resolve(__dirname, "../next.config.js"),
		},
	},

	docs: {},

	webpackFinal: async (storybookWebpackConfig) => {
		const plugins = storybookWebpackConfig.plugins || []
		const newConfig = {
			...storybookWebpackConfig,
			plugins: [
				...plugins,
				new webpack.DefinePlugin({
					"process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME": JSON.stringify(
						process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
					),
				}),
			],
		}
		return newConfig
	},

	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
}
export default config
