import Head from "next/head";
import { useEffect } from "react";
import { useData } from "@/utils/DataProvider";
import Footer from "./Footer/Footer";
import MetaData from "./MetaData";
import Navigation from "./Navigation/Navigation";

type NavLink = {
	location?: string;
	slug: string;
	pageName: string;
	[key: string]: any;
};

type PageType = {
	locale?: string;
	pageName?: string;
	metaData?: any;
	isLogoVisible?: boolean;
	isNavigationVisible?: boolean;
	[key: string]: any;
};

type SiteConfig = {
	footer?: any;
	[key: string]: any;
};

type LayoutProps = {
	page: PageType;
	siteConfig?: SiteConfig;
	navigationLinks: NavLink[];
	children?: React.ReactNode;
};

export const Layout = ({
	page,
	siteConfig,
	navigationLinks,
	children,
}: LayoutProps) => {
	const [state, setState] = useData() as [any, React.Dispatch<any>];

	useEffect(() => {
		setState({
			...state,
		});
	}, [page?.locale]);

	const footerNavLinks = navigationLinks.filter(
		(link) => link.location === "footer",
	);
	const allLinks = navigationLinks;
	const footerLinks = footerNavLinks;
	const seo = page?.metaData;

	return (
		<>
			<Head>
				<title>{seo?.pageTitle || page.pageName}</title>
			</Head>
			<MetaData
				title={seo?.pageTitle}
				description={seo?.pageDescription}
				keywords={seo?.keywords}
			/>
			<div className="content-grid">
				<Navigation
					pageLocale={page.locale ?? "en"}
					links={allLinks}
					siteConfig={siteConfig}
					isLogoVisible={page?.isLogoVisible}
					isNavigationVisible={page?.isNavigationVisible}
				/>
				{children}
				<Footer
					siteConfig={siteConfig?.footer}
					links={footerLinks}
					pageLocale={page.locale ?? "en"} // TODO:
				/>
			</div>
		</>
	);
};
