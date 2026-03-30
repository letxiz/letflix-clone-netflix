import { iniciarDropdown } from '../components/dropdown.js';
import { alternarMinhaLista, obterIdentificadorMinhaLista, obterMinhaListaPerfilAtivo } from '../components/minha-lista.js';
import { garantirPerfilAtivo, obterPerfil, limparPerfil, atualizarPreferencias } from '../components/perfil.js';
import { filmes } from '../data/filmes.js';
import { renderizarResultadosExternos } from '../components/cards.js';

const TMDB_API_KEY = 'ea110bd872a84533513e396662c97fcc';
const TMDB_SEARCH_ENDPOINT = 'https://api.themoviedb.org/3/search/multi';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';
let ultimoElementoComFocoModal = null;

function anunciarStatusAcessibilidade(mensagem) {
	const status = document.getElementById('a11y-status');
	if (!status) {
		return;
	}

	status.textContent = '';
	window.setTimeout(() => {
		status.textContent = mensagem;
	}, 10);
}

function atualizarEstadoChipsPreferencias() {
	document.querySelectorAll('#edit-genres-grid .genre-chip').forEach((chip) => {
		const selecionado = chip.classList.contains('selected');
		chip.setAttribute('aria-pressed', String(selecionado));
	});
}

function obterItemDoCard(card) {
	if (!card) {
		return null;
	}

	return {
		titulo: card.dataset.titulo || 'Sem titulo',
		imagem: card.dataset.imagem || '',
		tipo: card.dataset.tipo || '',
		arquivo: card.dataset.arquivo || '',
	};
}

function atualizarBotoesMinhaLista() {
	const itensSalvos = obterMinhaListaPerfilAtivo();
	const idsSalvos = new Set(itensSalvos.map((item) => item.id || obterIdentificadorMinhaLista(item)));

	document.querySelectorAll('.btn-add').forEach((botao) => {
		const item = obterItemDoCard(botao.closest('.movie-card'));
		const estaNaLista = item ? idsSalvos.has(obterIdentificadorMinhaLista(item)) : false;
		botao.classList.toggle('is-added', estaNaLista);
		botao.textContent = estaNaLista ? '−' : '+';
		botao.setAttribute('aria-pressed', String(estaNaLista));
		botao.setAttribute('aria-label', estaNaLista
			? `Remover ${item?.titulo || 'item'} da Minha Lista`
			: `Adicionar ${item?.titulo || 'item'} à Minha Lista`);
	});
}

function iniciarMinhaListaBusca() {
	document.addEventListener('click', (event) => {
		const botao = event.target.closest('.btn-add');
		if (!botao) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		const item = obterItemDoCard(botao.closest('.movie-card'));
		if (!item) {
			return;
		}

		const resultado = alternarMinhaLista(item);
		atualizarBotoesMinhaLista();
		if (resultado.sucesso) {
			anunciarStatusAcessibilidade(resultado.acao === 'adicionado'
				? `${item.titulo || 'Item'} adicionado a Minha Lista.`
				: `${item.titulo || 'Item'} removido de Minha Lista.`);
		}
	});
}

function abrirModalEditarPreferencias(nomePerfilAtivo) {
	const modal = document.getElementById('edit-preferences-modal');
	if (!modal) return;
	ultimoElementoComFocoModal = document.activeElement;

	// Reset all selections
	modal.querySelectorAll('#edit-genres-grid .genre-chip').forEach(chip => {
		chip.classList.remove('selected');
	});

	// Load current preferences
	const perfilAtual = obterPerfil(nomePerfilAtivo);
	if (perfilAtual && perfilAtual.preferencias && perfilAtual.preferencias.length > 0) {
		modal.querySelectorAll(`#edit-genres-grid .genre-chip[data-genre]`).forEach(chip => {
			if (perfilAtual.preferencias.includes(chip.dataset.genre)) {
				chip.classList.add('selected');
			}
		});
	}

	modal.classList.add('active');
	modal.setAttribute('aria-hidden', 'false');
	atualizarEstadoChipsPreferencias();
	const primeiroChip = modal.querySelector('.genre-chip');
	if (primeiroChip instanceof HTMLElement) {
		primeiroChip.focus();
	}
}

function fecharModalEditarPreferencias() {
	const modal = document.getElementById('edit-preferences-modal');
	if (modal) {
		modal.classList.remove('active');
		modal.setAttribute('aria-hidden', 'true');
		if (ultimoElementoComFocoModal instanceof HTMLElement) {
			ultimoElementoComFocoModal.focus();
		}
	}
}

function salvarPreferenciasEditar(nomePerfilAtivo) {
	const generosSelecionados = [];
	document.querySelectorAll('#edit-genres-grid .genre-chip.selected').forEach(chip => {
		generosSelecionados.push(chip.dataset.genre);
	});

	atualizarPreferencias(nomePerfilAtivo, generosSelecionados);
	fecharModalEditarPreferencias();

	// Reload page to show updated content
	window.location.reload();
}

function iniciarAcoesPerfil() {
	const trocarPerfilLink = document.getElementById('trocar-perfil');
	const editarPerfilBtn = document.getElementById('editar-perfil');
	const sairBtn = document.getElementById('sair');
	const nomePerfilAtivo = obterPerfil()?.nome || 'Leticinha';

	if (trocarPerfilLink) {
		trocarPerfilLink.addEventListener('click', () => {
			limparPerfil();
		});
	}

	if (editarPerfilBtn) {
		editarPerfilBtn.addEventListener('click', () => {
			abrirModalEditarPreferencias(nomePerfilAtivo);
		});
	}

	if (sairBtn) {
		sairBtn.addEventListener('click', () => {
			limparPerfil();
			window.location.href = 'perfis.html';
		});
	}

	// Modal preferences event listeners
	const editPrefsModal = document.getElementById('edit-preferences-modal');
	if (editPrefsModal) {
		const cancelBtn = document.getElementById('pref-cancel-btn');
		const saveBtn = document.getElementById('pref-save-btn');

		if (cancelBtn) {
			cancelBtn.addEventListener('click', fecharModalEditarPreferencias);
		}

		if (saveBtn) {
			saveBtn.addEventListener('click', () => {
				salvarPreferenciasEditar(nomePerfilAtivo);
			});
		}

		// Toggle genre chip selection
		editPrefsModal.querySelectorAll('#edit-genres-grid .genre-chip').forEach(chip => {
			chip.addEventListener('click', () => {
				chip.classList.toggle('selected');
				atualizarEstadoChipsPreferencias();
			});
		});

		atualizarEstadoChipsPreferencias();

		// Close modal on clicking outside
		editPrefsModal.addEventListener('click', (e) => {
			if (e.target === editPrefsModal) {
				fecharModalEditarPreferencias();
			}
		});

		editPrefsModal.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				fecharModalEditarPreferencias();
			}
		});
	}
}

async function buscarNoTMDB(termo) {
	if (!TMDB_API_KEY) {
		throw new Error('TMDB API key nao configurada. Defina TMDB_API_KEY em js/paginas/busca.js.');
	}

	const url = `${TMDB_SEARCH_ENDPOINT}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(termo)}&language=pt-BR&include_adult=false`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Falha ao consultar o TMDB. Status: ${response.status}`);
	}

	const data = await response.json();
	return (data.results || [])
		.filter((item) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
		.map((item) => ({
			titulo: item.title || item.name || 'Sem titulo',
			imagem: `${TMDB_IMAGE_BASE}${item.poster_path}`
		}));
}

function configurarNavegacaoBusca(searchInput, searchButton) {
	if (!searchInput || !searchButton) {
		return;
	}

	const searchContainer = searchInput.closest('.header-search');

	const redirecionarBusca = () => {
		const termo = searchInput.value.trim();
		if (!termo) {
			return;
		}

		window.location.href = `busca.html?q=${encodeURIComponent(termo)}`;
	};

	searchInput.addEventListener('keydown', (event) => {
		if (event.key !== 'Enter') {
			return;
		}

		event.preventDefault();
		redirecionarBusca();
	});

	searchButton.addEventListener('click', redirecionarBusca);

	const fecharBuscaAoInteragirFora = (event) => {
		if (!searchContainer) {
			return;
		}

		const alvo = event.target;
		if (searchContainer.contains(alvo)) {
			return;
		}

		if (document.activeElement === searchInput) {
			searchInput.blur();
		}
	};

	document.addEventListener('touchstart', fecharBuscaAoInteragirFora, { passive: true });
	document.addEventListener('touchmove', fecharBuscaAoInteragirFora, { passive: true });
}

function iniciarBotaoVoltarBusca(botaoVoltar) {
	if (!botaoVoltar) {
		return;
	}

	botaoVoltar.addEventListener('click', () => {
		const temHistorico = window.history.length > 1 && document.referrer !== '';

		if (temHistorico) {
			window.history.back();
			return;
		}

		window.location.href = 'catalogo.html';
	});
}

async function carregarResultadosBusca(searchInput, queryText, resultsGrid) {
	if (!searchInput || !queryText || !resultsGrid) {
		return;
	}

	const searchSection = document.querySelector('.search-page-section');
	const params = new URLSearchParams(window.location.search);
	const query = (params.get('q') || '').trim();
	searchInput.value = query;

	if (!query) {
		if (searchSection) {
			searchSection.style.display = 'none';
		}
		resultsGrid.innerHTML = '';
		return;
	}

	if (searchSection) {
		searchSection.style.display = '';
	}

	queryText.textContent = `Buscando por: ${query}`;

	try {
		const resultados = (await buscarNoTMDB(query)).slice(0, 12);

		if (resultados.length === 0) {
			queryText.textContent = `Nenhum resultado encontrado para: ${query}`;
			resultsGrid.innerHTML = '';
			return;
		}

		queryText.textContent = `${resultados.length} resultado(s) para: ${query}`;
		renderizarResultadosExternos(resultsGrid, resultados);
		atualizarBotoesMinhaLista();
	} catch (error) {
		console.error('Erro ao carregar resultados do TMDB:', error);
		queryText.textContent = 'Nao foi possivel carregar os resultados da busca.';
		resultsGrid.innerHTML = '';
	}
}

function iniciarPaginaBusca() {
	if (!garantirPerfilAtivo('perfis.html')) {
		return;
	}

	const perfisDisponiveis = Object.keys(filmes);
	const perfilAtivo = obterPerfil(perfisDisponiveis);
	const nomePerfilAtivo = perfilAtivo?.nome || '';

	if (!nomePerfilAtivo) {
		window.location.href = 'perfis.html';
		return;
	}

	const profileImage = document.getElementById('img-perfil');
	const perfilAtual = document.getElementById('perfil-atual');
	const searchInput = document.getElementById('busca-tmdb');
	const searchButton = document.getElementById('buscar-acao');
	const backButton = document.getElementById('mobile-back-button');
	const queryText = document.getElementById('busca-query-text');
	const resultsGrid = document.getElementById('resultados-busca-grid');

	if (profileImage) {
		if (perfilAtivo?.avatar) {
			profileImage.src = perfilAtivo.avatar;
		}
		profileImage.alt = `Perfil ${nomePerfilAtivo}`;
	}

	if (perfilAtual) {
		perfilAtual.textContent = nomePerfilAtivo;
	}

	iniciarDropdown();
	iniciarAcoesPerfil();
	configurarNavegacaoBusca(searchInput, searchButton);
	iniciarBotaoVoltarBusca(backButton);
	iniciarMinhaListaBusca();
	carregarResultadosBusca(searchInput, queryText, resultsGrid);
}

document.addEventListener('DOMContentLoaded', iniciarPaginaBusca);
