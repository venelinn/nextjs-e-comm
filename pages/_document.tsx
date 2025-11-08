import { Head, Html, Main, NextScript } from "next/document"
import React from "react"

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/static/favicons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/static/favicons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/static/favicons/favicon-16x16.png"
				/>
				<link rel="manifest" href="/static/favicons/site.webmanifest" />
				<link
					rel="mask-icon"
					href="/static/favicons/safari-pinned-tab.svg"
					color="#FF6000"
				/>
				<link rel="shortcut icon" href="/static/favicons/favicon.ico" />
				<meta name="msapplication-TileColor" content="#000000" />
				<meta
					name="msapplication-config"
					content="/static/favicons/browserconfig.xml"
				/>
				<meta name="theme-color" content="#000000" />
			</Head>

			<body>
				{process.env.CONTEXT === "production" && (
					<noscript>
						{React.createElement("iframe", {
							src: "https://www.googletagmanager.com/ns.html?id=GTM-KT3X3F",
							height: 0,
							width: 0,
							style: { display: "none", visibility: "hidden" },
						})}
					</noscript>
				)}
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
