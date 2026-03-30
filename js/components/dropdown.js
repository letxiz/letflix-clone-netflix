export function iniciarDropdown() {
	const catalogBody = document.body;
	const menuToggle = document.querySelector('.menu-toggle');
	const perfilHeader = document.getElementById('perfil-header');
	const perfilTrigger = document.getElementById('perfil-trigger');
	const perfilDropdown = document.getElementById('perfil-dropdown');
	const notifications = document.getElementById('notifications');
	const notificationsTrigger = document.getElementById('notifications-trigger');
	const notificationsPanel = document.getElementById('notifications-panel');
	const notificationsList = document.getElementById('notifications-list');
	const notificationsBadge = document.getElementById('notifications-badge');
	const notificationsClear = document.getElementById('notifications-clear');
	const NOTIFICACOES_STORAGE_PREFIX = 'notificacoes_';

	const obterNomePerfilAtivo = () => {
		try {
			const perfilAtivo = JSON.parse(localStorage.getItem('perfilAtivo') || 'null');
			if (perfilAtivo && typeof perfilAtivo === 'object' && perfilAtivo.nome) {
				return perfilAtivo.nome;
			}
		} catch {
			// Ignora erro de parse e usa fallback abaixo.
		}

		return localStorage.getItem('perfil') || '';
	};

	const obterNotificacoes = () => {
		const nomePerfil = obterNomePerfilAtivo();
		if (!nomePerfil) {
			return [];
		}

		try {
			const chave = `${NOTIFICACOES_STORAGE_PREFIX}${nomePerfil}`;
			const dados = JSON.parse(localStorage.getItem(chave) || '[]');
			return Array.isArray(dados)
				? dados.filter((item) => typeof item === 'string' && item.trim() !== '')
				: [];
		} catch {
			return [];
		}
	};

	const limparNotificacoesPerfil = () => {
		const nomePerfil = obterNomePerfilAtivo();
		if (!nomePerfil) {
			return;
		}

		const chave = `${NOTIFICACOES_STORAGE_PREFIX}${nomePerfil}`;
		localStorage.removeItem(chave);
		window.dispatchEvent(new CustomEvent('letflix:notificacoes-updated', {
			detail: { nomePerfil, chave, total: 0 }
		}));
	};

	const atualizarNotificacoesUI = () => {
		if (!notificationsList || !notificationsBadge) {
			return;
		}

		const notificacoes = obterNotificacoes();
		const total = notificacoes.length;
		notificationsBadge.textContent = String(Math.min(total, 99));
		notificationsBadge.style.display = total > 0 ? 'inline-flex' : 'none';

		if (notificationsTrigger) {
			notificationsTrigger.setAttribute(
				'aria-label',
				total > 0 ? `Abrir notificações. ${total} não lidas` : 'Abrir notificações. Nenhuma notificação'
			);
		}

		notificationsList.innerHTML = '';

		if (total === 0) {
			const vazio = document.createElement('li');
			vazio.className = 'notifications-empty';
			vazio.textContent = 'Nenhuma notificação por enquanto.';
			notificationsList.appendChild(vazio);
			return;
		}

		notificacoes.slice(0, 8).forEach((texto) => {
			const item = document.createElement('li');
			item.textContent = texto;
			notificationsList.appendChild(item);
		});
	};

	const closeProfileDropdown = () => {
		if (!perfilHeader || !perfilTrigger || !perfilDropdown) {
			return;
		}

		perfilHeader.classList.remove('open');
		perfilTrigger.setAttribute('aria-expanded', 'false');
		perfilDropdown.setAttribute('aria-hidden', 'true');
	};

	const closeNotificationsDropdown = () => {
		if (!notifications || !notificationsTrigger || !notificationsPanel) {
			return;
		}

		notifications.classList.remove('open');
		notificationsTrigger.setAttribute('aria-expanded', 'false');
		notificationsPanel.setAttribute('aria-hidden', 'true');
	};

	if (menuToggle && catalogBody) {
		menuToggle.addEventListener('click', () => {
			const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

			menuToggle.setAttribute('aria-expanded', String(!isExpanded));
			catalogBody.classList.toggle('nav-open');
		});
	}

	if (!perfilHeader || !perfilTrigger || !perfilDropdown) {
		atualizarNotificacoesUI();
	} else {
		perfilTrigger.addEventListener('click', () => {
			const isOpen = perfilHeader.classList.toggle('open');

			perfilTrigger.setAttribute('aria-expanded', String(isOpen));
			perfilDropdown.setAttribute('aria-hidden', String(!isOpen));

			if (isOpen) {
				closeNotificationsDropdown();
				const primeiroItem = perfilDropdown.querySelector('.perfil-item');
				if (primeiroItem instanceof HTMLElement) {
					primeiroItem.focus();
				}
			}
		});
	}

	if (notifications && notificationsTrigger && notificationsPanel) {
		atualizarNotificacoesUI();
		notificationsTrigger.addEventListener('click', () => {
			const isOpen = notifications.classList.toggle('open');

			notificationsTrigger.setAttribute('aria-expanded', String(isOpen));
			notificationsPanel.setAttribute('aria-hidden', String(!isOpen));

			if (isOpen) {
				closeProfileDropdown();
				atualizarNotificacoesUI();
				const primeiroBotao = notificationsPanel.querySelector('button, [tabindex]');
				if (primeiroBotao instanceof HTMLElement) {
					primeiroBotao.focus();
				}
			}
		});

		if (notificationsClear) {
			notificationsClear.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				limparNotificacoesPerfil();
				atualizarNotificacoesUI();
			});
		}
	}

	document.addEventListener('click', (event) => {
		if (perfilHeader && !perfilHeader.contains(event.target)) {
			closeProfileDropdown();
		}

		if (notifications && !notifications.contains(event.target)) {
			closeNotificationsDropdown();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape') {
			return;
		}

		const notificacoesAberto = notifications && notifications.classList.contains('open');
		const perfilAberto = perfilHeader && perfilHeader.classList.contains('open');

		closeProfileDropdown();
		closeNotificationsDropdown();

		if (notificacoesAberto && notificationsTrigger instanceof HTMLElement) {
			notificationsTrigger.focus();
		} else if (perfilAberto && perfilTrigger instanceof HTMLElement) {
			perfilTrigger.focus();
		}
	});

	window.addEventListener('letflix:notificacoes-updated', atualizarNotificacoesUI);
	window.addEventListener('focus', atualizarNotificacoesUI);
}
