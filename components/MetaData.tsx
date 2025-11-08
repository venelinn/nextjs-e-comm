import Head from "next/head";
import { useRouter } from "next/router";

interface MetaDataProps {
	title?: string;
	description?: string;
	image?: string;
	logo?: string;
	type?: string;
	date?: string;
	keywords?: string;
}

export default function MetaData({
	title,
	description,
	keywords,
	image,
	logo,
	type,
	date,
	...customMeta
}: MetaDataProps) {
	const router = useRouter();
	// const frenchRoute = "/fr" + (router.asPath);
	// const route = process.env.NEXT_PUBLIC_BASE_URL + (router.locale === "fr" ? frenchRoute : router.asPath);
	const route = process.env.NEXT_PUBLIC_BASE_URL + router.asPath;
	// const route = process.env.NEXT_PUBLIC_BASE_URL;
	// const frenchRoute = router.locale === "fr" ? "/fr" + router.asPath : null;

	const meta = {
		title: title || "DoCharge.me",
		description: description || "DoCharge.me | docharge.me",
		keywords: keywords || "band, rock band, band 80s",
		image: image || `${process.env.NEXT_PUBLIC_BASE_URL}/static/og-image.jpg`,
		logo: logo || `${process.env.NEXT_PUBLIC_BASE_URL}/static/logo.png`,
		type: type || "website",
		...customMeta,
	};

	return (
		<Head>
			{/* <title>{meta.title}</title> */}
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content={meta.description} />
			<meta name="keywords" content={meta.keywords} />
			<meta property="og:title" content={meta.title} />
			<meta property="og:type" content={meta.type} />
			<meta property="og:image" content={meta.image} />
			<meta property="og:logo" content={meta.logo} />
			<meta property="og:url" content={route} />
			<meta property="og:description" content={meta.description} />
			<meta name="robots" content="follow, index" />
			<meta name="color-scheme" content="light dark" />
			<link rel="canonical" href={route} />
			<meta
				name="google-site-verification"
				content="nUA_iL8L_0u8UoXtxBhLE8dSuJ6e04s1dFv2UZSBRBc"
			/>
		</Head>
	);
}
