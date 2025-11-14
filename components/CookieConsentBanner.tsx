import React, { useState, useEffect } from 'react';

const COOKIE_KEY = 'cookie_consent';

export default function CookieConsentBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const consent = typeof window !== 'undefined' ? localStorage.getItem(COOKIE_KEY) : null;
		setVisible(!consent);
	}, []);

	const handleConsent = (accept: boolean) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(COOKIE_KEY, accept ? 'accepted' : 'rejected');
		}
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between shadow-lg">
			<div className="mb-2 md:mb-0">
				Folosim cookie-uri pentru a îmbunătăți experiența pe site. <a href="/politica-cookies" className="underline text-blue-300" target="_blank" rel="noopener noreferrer">Află mai multe</a>.
			</div>
			<div className="flex gap-2">
				<button
					className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
					onClick={() => handleConsent(true)}
				>Accept</button>
				<button
					className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
					onClick={() => handleConsent(false)}
				>Refuz</button>
			</div>
		</div>
	);
}