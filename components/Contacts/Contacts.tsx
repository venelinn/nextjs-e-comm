"use client";

import cx from "clsx";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import styles from "./Contacts.module.scss";

type FormStatus = "pending" | "ok" | "error" | null;

export const Contacts: React.FC = () => {
	const [status, setStatus] = useState<FormStatus>(null);
	const [error, setError] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const items = Array.from(
			containerRef.current.querySelectorAll<HTMLElement>("[data-anim-item]"),
		);

		gsap.fromTo(
			items,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				stagger: 0.1,
				delay: 2.5,
				duration: 0.6,
				ease: "power4.out",
			},
		);
	}, []);

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			setStatus("pending");
			setError(null);

			const myForm = event.currentTarget;
			const formData = new FormData(myForm);

			const res = await fetch("/__forms.html", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams(formData as any).toString(),
			});

			if (res.status === 200) {
				setStatus("ok");
			} else {
				setStatus("error");
				setError(`${res.status} ${res.statusText}`);
			}
		} catch (e) {
			setStatus("error");
			setError(String(e));
		}
	};

	return (
		<div className={styles.contact} ref={containerRef}>
			<form name="feedback" onSubmit={handleFormSubmit}>
				<input type="hidden" name="form-name" value="feedback" />

				<p className={styles.contact__item} data-anim-item>
					<label>
						<span>Name</span>
						<input
							aria-label="Name"
							required
							name="name"
							type="text"
							placeholder="Name"
							minLength={2}
						/>
					</label>
				</p>

				<p className={styles.contact__item} data-anim-item>
					<label>
						<span>Email</span>
						<input
							name="email"
							type="email"
							aria-label="Email"
							required
							placeholder="Email"
						/>
					</label>
				</p>

				<p className={styles.contact__item} data-anim-item>
					<label>
						<span>Message</span>
						<textarea
							name="message"
							placeholder="Message"
							aria-label="Message"
							required
							rows={5}
							cols={5}
						/>
					</label>
				</p>

				<p
					className={cx(styles.contact__item, styles["contact__item--right"])}
					data-anim-item
				>
					<Button
						variant="primary"
						type="submit"
						label="Submit"
						disabled={status === "pending"}
					/>
				</p>

				{status === "ok" && (
					<div className="alert alert-success">Submitted!</div>
				)}

				{status === "error" && <div className="alert alert-error">{error}</div>}
			</form>
		</div>
	);
};

export default Contacts;
