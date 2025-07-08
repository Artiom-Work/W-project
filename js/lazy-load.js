'use strict';

document.addEventListener('DOMContentLoaded', () => {

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const marker = entry.target;
				const nextElement = marker.nextElementSibling;

				if (nextElement &&
					nextElement.classList.contains('lazy-load') &&
					nextElement.getAttribute('style')?.includes('display: none')) {

					nextElement.removeAttribute('style');
					nextElement.style.opacity = '0';
					nextElement.style.transform = 'translateY(-10vh)';
					nextElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

					setTimeout(() => {
						nextElement.style.opacity = '1';
						nextElement.style.transform = 'translateY(0)';
					}, 100);

					observer.unobserve(marker);
					marker.remove();

					const nextMarker = document.querySelector('.load-marker');
					if (nextMarker) {
						observer.observe(nextMarker);
					}
				}
			}
		});
	}, {
		rootMargin: '200px 0px',
		threshold: 0.1
	});

	const firstMarker = document.querySelector('.load-marker');
	if (firstMarker) {
		observer.observe(firstMarker);
	}
});