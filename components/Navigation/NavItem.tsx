import cx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import type React from "react";

type NavItemProps = {
	href: string;
	title?: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	className?: string;
};

const NavItem = ({ href, title, onClick, className }: NavItemProps) => {
	const router = useRouter();
	const isActive = router.asPath === href;
	return (
		<Link
			href={href}
			className={cx("link", className ? { [className]: isActive } : undefined)}
			onClick={onClick}
		>
			<span className="link__text">{title}</span>
		</Link>
	);
};

export default NavItem;
export { NavItem };
