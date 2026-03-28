export function iniciarDropdown() {
	const catalogBody = document.body;
	const menuToggle = document.querySelector('.menu-toggle');
	const perfilHeader = document.getElementById('perfil-header');
	const perfilTrigger = document.getElementById('perfil-trigger');
	const perfilDropdown = document.getElementById('perfil-dropdown');
	const closeProfileDropdown = () => {
		perfilHeader.classList.remove('open');
		perfilTrigger.setAttribute('aria-expanded', 'false');
		perfilDropdown.setAttribute('aria-hidden', 'true');
	};

	if (menuToggle && catalogBody) {
		menuToggle.addEventListener('click', () => {
			const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

			menuToggle.setAttribute('aria-expanded', String(!isExpanded));
			catalogBody.classList.toggle('nav-open');
		});
	}

	if (!perfilHeader || !perfilTrigger || !perfilDropdown) {
		return;
	}

	perfilTrigger.addEventListener('click', () => {
		const isOpen = perfilHeader.classList.toggle('open');

		perfilTrigger.setAttribute('aria-expanded', String(isOpen));
		perfilDropdown.setAttribute('aria-hidden', String(!isOpen));

		if (isOpen) {
			const primeiroItem = perfilDropdown.querySelector('.perfil-item');
			if (primeiroItem instanceof HTMLElement) {
				primeiroItem.focus();
			}
		}
	});

	document.addEventListener('click', (event) => {
		if (!perfilHeader.contains(event.target)) {
			closeProfileDropdown();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape') {
			return;
		}

		closeProfileDropdown();
		perfilTrigger.focus();
	});
}
