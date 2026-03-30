const NOTIFICACOES_STORAGE_PREFIX = 'notificacoes_';

function obterNomePerfilAtivo() {
	try {
		const perfilAtivo = JSON.parse(localStorage.getItem('perfilAtivo') || 'null');
		if (perfilAtivo && typeof perfilAtivo === 'object' && perfilAtivo.nome) {
			return perfilAtivo.nome;
		}
	} catch {
		// Ignora e usa fallback abaixo.
	}

	return localStorage.getItem('perfil') || '';
}

function obterNotificacoes(nomePerfil) {
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
}

function renderizarListaNotificacoes() {
	const nomePerfil = obterNomePerfilAtivo();
	const subtitle = document.getElementById('notifications-subtitle');
	const lista = document.getElementById('notifications-page-list');

	if (!lista || !subtitle) {
		return;
	}

	if (!nomePerfil) {
		subtitle.textContent = 'Nenhum perfil ativo.';
		lista.innerHTML = '<li class="notifications-page-empty">Selecione um perfil para ver suas notificações.</li>';
		return;
	}

	subtitle.textContent = `Perfil: ${nomePerfil}`;
	const notificacoes = obterNotificacoes(nomePerfil);
	lista.innerHTML = '';

	if (notificacoes.length === 0) {
		lista.innerHTML = '<li class="notifications-page-empty">Nenhuma notificação por enquanto.</li>';
		return;
	}

	notificacoes.slice(0, 60).forEach((texto) => {
		const item = document.createElement('li');
		item.textContent = texto;
		lista.appendChild(item);
	});
}

function limparNotificacoes() {
	const nomePerfil = obterNomePerfilAtivo();
	if (!nomePerfil) {
		return;
	}

	const chave = `${NOTIFICACOES_STORAGE_PREFIX}${nomePerfil}`;
	localStorage.removeItem(chave);
	window.dispatchEvent(new CustomEvent('letflix:notificacoes-updated', {
		detail: { nomePerfil, chave, total: 0 }
	}));
	renderizarListaNotificacoes();
}

function iniciarVoltar() {
	const botaoVoltar = document.getElementById('notifications-back');
	if (!botaoVoltar) {
		return;
	}

	botaoVoltar.addEventListener('click', () => {
		const temHistorico = window.history.length > 1;
		if (temHistorico) {
			window.history.back();
			return;
		}

		window.location.href = 'catalogo.html';
	});
}

function iniciarPaginaNotificacoes() {
	const botaoLimpar = document.getElementById('notifications-page-clear');

	iniciarVoltar();
	renderizarListaNotificacoes();

	if (botaoLimpar) {
		botaoLimpar.addEventListener('click', limparNotificacoes);
	}

	window.addEventListener('letflix:notificacoes-updated', renderizarListaNotificacoes);
	window.addEventListener('storage', renderizarListaNotificacoes);
}

iniciarPaginaNotificacoes();
