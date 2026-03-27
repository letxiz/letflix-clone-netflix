import { iniciarDropdown } from '../components/dropdown.js';
import { adicionarMinhaLista, obterIdentificadorMinhaLista, obterMinhaListaPerfilAtivo } from '../components/minha-lista.js';
import { garantirPerfilAtivo, obterPerfil, limparPerfil, atualizarPreferencias } from '../components/perfil.js';
import { filmes } from '../data/filmes.js';
import { renderizarResultadosExternos } from '../components/cards.js';

const TMDB_API_KEY = 'ea110bd872a84533513e396662c97fcc';
const TMDB_SEARCH_ENDPOINT = 'https://api.themoviedb.org/3/search/multi';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

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
		botao.textContent = estaNaLista ? '✓' : '+';
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

		adicionarMinhaLista(item);
		atualizarBotoesMinhaLista();
	});
}

function abrirModalEditarPreferencias(nomePerfilAtivo) {
	const modal = document.getElementById('edit-preferences-modal');
	if (!modal) return;

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
}

function fecharModalEditarPreferencias() {
	const modal = document.getElementById('edit-preferences-modal');
	if (modal) {
		modal.classList.remove('active');
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
			chip.addEventListener('click', () => chip.classList.toggle('selected'));
		});

		// Close modal on clicking outside
		editPrefsModal.addEventListener('click', (e) => {
			if (e.target === editPrefsModal) {
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
	iniciarMinhaListaBusca();
	carregarResultadosBusca(searchInput, queryText, resultsGrid);
}

document.addEventListener('DOMContentLoaded', iniciarPaginaBusca);
