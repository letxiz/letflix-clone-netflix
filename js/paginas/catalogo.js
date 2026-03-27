import { renderizarCards, renderizarCardsLocais, renderizarLista } from '../components/cards.js';
import { iniciarDropdown } from '../components/dropdown.js';
import { alternarMinhaLista, obterIdentificadorMinhaLista, obterMinhaListaPerfilAtivo } from '../components/minha-lista.js';
import { garantirPerfilAtivo, obterPerfil, limparPerfil, obterPerfilPorNome, atualizarPreferencias } from '../components/perfil.js';
import { generosLocais } from '../data/generos.js';
import { filmes, minhaLista } from '../data/filmes.js';
import { series } from '../data/series.js';

const INFO_AUTO_CLOSE_MS = 6000;
let infoAutoCloseTimer = null;

const DESTAQUE_GENERICO = {
	titulo: 'Seu perfil LETFLIX',
	meta: 'Escolha seus gêneros favoritos',
	descricao: 'Selecione seus gêneros em Editar perfil para receber um destaque com trailer, informações e onde assistir.',
	elenco: '',
	generos: 'Personalizado',
	trailer: '',
	assistir: ''
};

const DESTAQUES_POR_GENERO = {
	anime: {
		titulo: 'To Your Eternity',
		meta: '2021 • 2 temporadas • 16+',
		descricao: 'Um ser imortal é enviado à Terra e aprende sobre a vida, morte e emoções humanas ao longo do tempo.',
		elenco: '',
		generos: 'Anime, Drama, Fantasia',
		trailer: 'https://youtu.be/LaCj6exkMt0',
		assistir: 'https://www.crunchyroll.com/pt-br/series/GG5H5XMWV/to-your-eternity'
	},
	comedia: {
		titulo: 'Gente Grande',
		meta: '2010 • 1h 42min • 12+',
		descricao: 'Cinco amigos se reencontram após anos e passam um fim de semana juntos com suas famílias.',
		elenco: '',
		generos: 'Comédia, Família',
		trailer: 'https://youtu.be/5FiDt6tD7hw',
		assistir: 'https://www.primevideo.com/'
	},
	terror: {
		titulo: 'Invocação do Mal',
		meta: '2013 • 1h 52min • 16+',
		descricao: 'Investigadores paranormais ajudam uma família aterrorizada por uma presença maligna.',
		elenco: '',
		generos: 'Terror, Suspense, Sobrenatural',
		trailer: 'https://youtu.be/muCzwjyKfpU',
		assistir: 'https://www.hbomax.com/'
	},
	romance: {
		titulo: 'Diário de uma Paixão',
		meta: '2004 • 2h 03min • 12+',
		descricao: 'Um romance intenso que supera diferenças sociais e o tempo.',
		elenco: '',
		generos: 'Romance, Drama',
		trailer: 'https://youtu.be/DyfWPxB1pZM',
		assistir: 'https://www.primevideo.com/'
	},
	acao: {
		titulo: 'Gladiador',
		meta: '2000 • 2h 35min • 16+',
		descricao: 'Um general romano busca vingança após perder tudo.',
		elenco: '',
		generos: 'Ação, Drama, Histórico',
		trailer: 'https://youtu.be/cXg62-t8BWs',
		assistir: 'https://www.primevideo.com/'
	}
};

const DESTAQUES_POR_PERFIL = {
	Leticinha: {
		titulo: 'Suits',
		meta: '2011 • 9 temporadas • 14+',
		descricao: 'Um advogado brilhante abandona a faculdade, mas consegue um emprego em um grande escritório de advocacia, mesmo sem diploma.',
		elenco: 'Gabriel Macht, Patrick J. Adams, Meghan Markle',
		generos: 'Drama, Jurídico',
		trailer: '',
		assistir: 'https://www.netflix.com/br/title/70195800'
	},
	Maria: {
		titulo: 'Toy Story 3',
		meta: '2010 • 1h 43min • Livre',
		descricao: 'Woody, Buzz e seus amigos enfrentam novos desafios quando são levados para uma creche enquanto Andy cresce.',
		elenco: '',
		generos: 'Animação, Aventura, Infantil',
		trailer: '',
		assistir: 'https://www.disneyplus.com/pt-br/browse/entity-95e7b2ce-5f45-4923-976d-b7e9968a7357'
	},
	Evellyn: {
		titulo: 'To Your Eternity',
		meta: '2021 • 2 temporadas • 16+',
		descricao: 'Um ser imortal é enviado à Terra e aprende sobre a vida, morte e emoções humanas ao longo do tempo.',
		elenco: '',
		generos: 'Anime, Drama, Fantasia',
		trailer: 'https://youtu.be/LaCj6exkMt0',
		assistir: 'https://www.crunchyroll.com/pt-br/series/GG5H5XMWV/to-your-eternity'
	}
};

function normalizarGenero(genero) {
	return typeof genero === 'string'
		? genero.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
		: '';
}

function obterDestaqueHero(perfil) {
	if (!perfil) {
		return DESTAQUE_GENERICO;
	}

	if (perfil.nome && DESTAQUES_POR_PERFIL[perfil.nome]) {
		return DESTAQUES_POR_PERFIL[perfil.nome];
	}

	const preferencias = Array.isArray(perfil.preferencias) ? perfil.preferencias : [];
	for (const genero of preferencias) {
		const generoNormalizado = normalizarGenero(genero);
		if (DESTAQUES_POR_GENERO[generoNormalizado]) {
			return DESTAQUES_POR_GENERO[generoNormalizado];
		}
	}

	return DESTAQUE_GENERICO;
}

function obterItensIniciaisMinhaLista(nomePerfilAtivo) {
	return (minhaLista[nomePerfilAtivo] || []).map((item) => ({
		...item,
		titulo: item.arquivo.replace(/\.[^/.]+$/, ''),
		imagem: `assets/${item.tipo}/${nomePerfilAtivo}/${item.arquivo}`,
	}));
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

function atualizarBotoesMinhaLista(itensIniciais = []) {
	const itensSalvos = obterMinhaListaPerfilAtivo(itensIniciais);
	const idsSalvos = new Set(itensSalvos.map((item) => item.id || obterIdentificadorMinhaLista(item)));

	document.querySelectorAll('.btn-add').forEach((botao) => {
		const item = obterItemDoCard(botao.closest('.movie-card'));
		const estaNaLista = item ? idsSalvos.has(obterIdentificadorMinhaLista(item)) : false;
		botao.classList.toggle('is-added', estaNaLista);
		botao.textContent = estaNaLista ? '−' : '+';
		botao.setAttribute('aria-label', estaNaLista
			? `Remover ${item?.titulo || 'item'} da Minha Lista`
			: `Adicionar ${item?.titulo || 'item'} à Minha Lista`);
	});
}

function renderizarMinhaListaAtiva(listaContainer, nomePerfilAtivo) {
	const itensIniciais = obterItensIniciaisMinhaLista(nomePerfilAtivo);
	const itensLista = obterMinhaListaPerfilAtivo(itensIniciais);
	renderizarLista(listaContainer, nomePerfilAtivo, itensLista);
	atualizarBotoesMinhaLista(itensIniciais);
	return itensIniciais;
}

function iniciarMinhaLista(listaContainer, nomePerfilAtivo) {
	if (!listaContainer) {
		return;
	}

	const itensIniciais = renderizarMinhaListaAtiva(listaContainer, nomePerfilAtivo);

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

		const resultado = alternarMinhaLista(item, itensIniciais);
		if (resultado.sucesso) {
			renderizarMinhaListaAtiva(listaContainer, nomePerfilAtivo);
		}

		atualizarBotoesMinhaLista(itensIniciais);
	});
}

function abrirLinkAssistir(perfil) {
	const destaque = obterDestaqueHero(perfil);

	if (!destaque.assistir) {
		if (perfil?.nome) {
			abrirModalEditarPreferencias(perfil.nome);
		}
		return;
	}

	const openedWindow = window.open(destaque.assistir, '_blank', 'noopener,noreferrer');

	if (!openedWindow) {
		window.location.assign(destaque.assistir);
	}
}

function fecharInfoPanel() {
	const info = document.getElementById('info-filme');
	if (!info) {
		return;
	}

	info.classList.remove('is-visible');
	info.setAttribute('aria-hidden', 'true');

	const maisInformacoesBtn = document.getElementById('mais-informacoes');
	if (maisInformacoesBtn) {
		maisInformacoesBtn.setAttribute('aria-expanded', 'false');
	}
}

function mostrarInfo(perfil) {
	const info = document.getElementById('info-filme');
	if (!info) {
		return;
	}

	const conteudo = obterDestaqueHero(perfil);
	const elencoLinha = conteudo.elenco ? `<p><strong>Elenco:</strong> ${conteudo.elenco}</p>` : '';
	const trailerLinha = conteudo.trailer
		? `<p><strong>Trailer:</strong> <a href="${conteudo.trailer}" target="_blank" rel="noopener noreferrer">Assistir trailer</a></p>`
		: '';

	info.innerHTML = `
		<div class="info-grid">
			<div class="info-main">
				<h2>${conteudo.titulo}</h2>
				<p class="info-meta">${conteudo.meta}</p>
				<p class="info-description">${conteudo.descricao}</p>
			</div>
			<div class="info-side">
				${elencoLinha}
				<p><strong>Gêneros:</strong> ${conteudo.generos}</p>
				${trailerLinha}
			</div>
		</div>
	`;

	info.classList.add('is-visible');
	info.setAttribute('aria-hidden', 'false');

	const maisInformacoesBtn = document.getElementById('mais-informacoes');
	if (maisInformacoesBtn) {
		maisInformacoesBtn.setAttribute('aria-expanded', 'true');
	}

	if (infoAutoCloseTimer) {
		window.clearTimeout(infoAutoCloseTimer);
	}

	infoAutoCloseTimer = window.setTimeout(() => {
		fecharInfoPanel();
		infoAutoCloseTimer = null;
	}, INFO_AUTO_CLOSE_MS);

	info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

function atualizarEstadoHero(perfilAtivo) {
	const assistirAgora = document.getElementById('assistir-agora');
	if (!assistirAgora) {
		return;
	}

	const destaque = obterDestaqueHero(perfilAtivo);
	assistirAgora.textContent = destaque.assistir ? 'Assistir agora' : 'Escolher preferências';
}

function iniciarAcoesHero(perfilAtivo) {
	const assistirAgora = document.getElementById('assistir-agora');
	const maisInformacoes = document.getElementById('mais-informacoes');

	if (assistirAgora) {
		assistirAgora.addEventListener('click', () => abrirLinkAssistir(perfilAtivo));
	}

	if (maisInformacoes) {
		maisInformacoes.addEventListener('click', () => mostrarInfo(perfilAtivo));
	}
}

function iniciarBusca(searchInput, searchButton) {
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

	searchButton.addEventListener('click', () => {
		redirecionarBusca();
		searchInput.focus();
	});

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

async function carregarSecaoGenero(genero, container) {
	const generoNormalizado = normalizarGenero(genero);
	const config = generosLocais[generoNormalizado];
	if (!config || !container) {
		return;
	}

	const itensFilmes = config.filmes.map((arquivo) => ({
		titulo: arquivo.replace(/\.[^/.]+$/, ''),
		imagem: `assets/generos/filmes/${generoNormalizado}/${arquivo}`,
	}));
	const itensSeries = config.series.map((arquivo) => ({
		titulo: arquivo.replace(/\.[^/.]+$/, ''),
		imagem: `assets/generos/series/${generoNormalizado}/${arquivo}`,
	}));

	if (itensFilmes.length > 0) {
		const secaoFilmes = document.createElement('section');
		const secaoFilmesId = `local-filmes-${generoNormalizado}`;
		secaoFilmes.className = 'catalog-section';
		secaoFilmes.setAttribute('aria-labelledby', secaoFilmesId);
		secaoFilmes.innerHTML = `
			<div class="section-heading">
				<h2 id="${secaoFilmesId}">Filmes de ${config.titulo}</h2>
			</div>
			<div class="movie-row" aria-label="Filmes de ${config.titulo}"></div>
		`;
		container.appendChild(secaoFilmes);
		renderizarCardsLocais(secaoFilmes.querySelector('.movie-row'), itensFilmes);
	}

	if (itensSeries.length > 0) {
		const secaoSeries = document.createElement('section');
		const secaoSeriesId = `local-series-${generoNormalizado}`;
		secaoSeries.className = 'catalog-section';
		secaoSeries.setAttribute('aria-labelledby', secaoSeriesId);
		secaoSeries.innerHTML = `
			<div class="section-heading">
				<h2 id="${secaoSeriesId}">Séries de ${config.titulo}</h2>
			</div>
			<div class="movie-row" aria-label="Séries de ${config.titulo}"></div>
		`;
		container.appendChild(secaoSeries);
		renderizarCardsLocais(secaoSeries.querySelector('.movie-row'), itensSeries);
	}
}

function aplicarBannerHero(hero, nomePerfil) {
	if (!hero) {
		return;
	}

	const fallback = 'assets/background.jpg';
	if (!nomePerfil) {
		hero.style.backgroundImage = `url("${fallback}")`;
		return;
	}

	const banner = `assets/banner/${nomePerfil}.jpg`;
	const imagemTeste = new Image();

	imagemTeste.onload = () => {
		hero.style.backgroundImage = `url("${encodeURI(banner)}")`;
	};

	imagemTeste.onerror = () => {
		hero.style.backgroundImage = `url("${fallback}")`;
	};

	imagemTeste.src = banner;
}

async function iniciarCatalogo() {
	if (!garantirPerfilAtivo('perfis.html')) {
		return;
	}

	let perfilAtivoStorage = null;
	try {
		perfilAtivoStorage = JSON.parse(localStorage.getItem('perfilAtivo') || 'null');
	} catch {
		perfilAtivoStorage = null;
	}
	const perfisDisponiveis = Object.keys(filmes);
	const perfilAtivo = obterPerfil(perfisDisponiveis);
	const nomePerfilAtivo = perfilAtivoStorage?.nome || perfilAtivo?.nome || '';
	const perfilObj = obterPerfilPorNome(nomePerfilAtivo) || perfilAtivo;

	if (!nomePerfilAtivo) {
		window.location.href = 'perfis.html';
		return;
	}

	const filmesContainer = document.getElementById('filmes');
	const seriesContainer = document.getElementById('series');
	const listaContainer = document.getElementById('lista');
	const heroProfile = document.getElementById('hero-profile');
	const hero = document.getElementById('inicio');
	const profileImage = document.getElementById('img-perfil');
	const perfilAtual = document.getElementById('perfil-atual');
	const searchInput = document.getElementById('busca-tmdb');
	const searchButton = document.getElementById('buscar-acao');
	const secPersonalizado = document.getElementById('sec-personalizado');

	if (heroProfile) {
		heroProfile.textContent = nomePerfilAtivo;
	}

	if (profileImage) {
		if (perfilObj?.avatar) {
			profileImage.src = perfilObj.avatar;
		}
		profileImage.alt = `Perfil ${nomePerfilAtivo}`;
	}

	if (perfilAtual) {
		perfilAtual.textContent = nomePerfilAtivo;
	}

	if (hero) {
		aplicarBannerHero(hero, nomePerfilAtivo);
	}

	atualizarEstadoHero(perfilObj);

	renderizarCards(filmesContainer, nomePerfilAtivo, filmes[nomePerfilAtivo] || [], 'filmes');
	renderizarCards(seriesContainer, nomePerfilAtivo, series[nomePerfilAtivo] || [], 'series');
	iniciarMinhaLista(listaContainer, nomePerfilAtivo);

	iniciarDropdown();
	iniciarAcoesPerfil();
	iniciarAcoesHero(perfilObj);
	iniciarBusca(searchInput, searchButton);

	// Seções personalizadas por preferências — só para perfis com gêneros definidos
	if (secPersonalizado) {
		secPersonalizado.innerHTML = '';
		const preferencias = perfilObj?.preferencias ?? [];
		if (preferencias.length > 0) {
			for (const genero of preferencias) {
				await carregarSecaoGenero(genero, secPersonalizado);
			}
		}
	}

	atualizarBotoesMinhaLista(obterItensIniciaisMinhaLista(nomePerfilAtivo));
}

document.addEventListener('DOMContentLoaded', iniciarCatalogo);
