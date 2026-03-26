document.addEventListener('DOMContentLoaded', () => {
	const profileLinks = document.querySelectorAll('.profile-link');
	const menuToggle = document.querySelector('.menu-toggle');
	const profileImage = document.getElementById('img-perfil');
	const perfilHeader = document.getElementById('perfil-header');
	const perfilTrigger = document.getElementById('perfil-trigger');
	const perfilDropdown = document.getElementById('perfil-dropdown');
	const perfilAtual = document.getElementById('perfil-atual');
	const gerenciarPerfisBtn = document.getElementById('gerenciar-perfis');
	const sairBtn = document.getElementById('sair');
	const trocarPerfilLink = document.getElementById('trocar-perfil');
	const assistirAgoraBtn = document.getElementById('assistir-agora');
	const catalogBody = document.body;

	const dados = {
		Leticinha: {
			filmes: ['HarryPotter1.jpg', 'HarryPotter2.jpg', 'HarryPotter3.jpg', 'Para Todos os Garotos.jpg', 'Questao de Tempo.jpg'],
			series: ['TheOriginals.avf', 'TheVampireDiaries.jpg'],
			lista: [
				{ tipo: 'filmes', arquivo: 'HarryPotter2.jpg' },
				{ tipo: 'series', arquivo: 'TheVampireDiaries.jpg' },
				{ tipo: 'filmes', arquivo: 'Para Todos os Garotos.jpg' },
				{ tipo: 'series', arquivo: 'TheOriginals.avf' }
			]
		},
		Pedro: {
			filmes: ['John Wick.jpg', 'Missão Impossível.jpg', 'Transformers.avf', 'Velozes e Furiosos.jpg'],
			series: ['Prison Break.jpg', 'The Boys.jpg'],
			lista: [
				{ tipo: 'filmes', arquivo: 'John Wick.jpg' },
				{ tipo: 'series', arquivo: 'The Boys.jpg' },
				{ tipo: 'filmes', arquivo: 'Missão Impossível.jpg' },
				{ tipo: 'series', arquivo: 'Prison Break.jpg' }
			]
		},
		Maria: {
			filmes: ['carrosel.jpg', 'Galinha Pintadinha.jpg', 'Guerreirad do Kpop.jpg', 'Marsha & Urso.jpg', 'Patrulha Canina.jpg'],
			series: ['Baby Shark.jpg', 'Lucas the Spider.jpg', 'Turma da Mônica.jpg'],
			lista: [
				{ tipo: 'filmes', arquivo: 'Guerreirad do Kpop.jpg' },
				{ tipo: 'series', arquivo: 'Baby Shark.jpg' },
				{ tipo: 'filmes', arquivo: 'Patrulha Canina.jpg' },
				{ tipo: 'series', arquivo: 'Turma da Mônica.jpg' }
			]
		},
		Evellyn: {
			filmes: ['Attack on Titan.avf'],
			series: ['13 reasons why.avf', 'bungou stray dogs.jpg', 'fumetsu no anata.jpg', 'Hellsing.jpg', 'to your eternity.jpg'],
			lista: [
				{ tipo: 'series', arquivo: 'Hellsing.jpg' },
				{ tipo: 'filmes', arquivo: 'Attack on Titan.avf' },
				{ tipo: 'series', arquivo: 'bungou stray dogs.jpg' },
				{ tipo: 'series', arquivo: 'to your eternity.jpg' }
			]
		}
	};

	const bannerPorPerfil = {
		Leticinha: 'Leticia.jpg',
		Pedro: 'Pedro.jpg',
		Maria: 'Maria.jpg',
		Evellyn: 'Evellyn.jpg'
	};

	const avatarPorPerfil = {
		Leticinha: 'capa1.avif',
		Pedro: 'capa2.jpg',
		Maria: 'capa3.jpg',
		Evellyn: 'capa4.avif'
	};

	const linkAssistirPorPerfil = {
		Leticinha: 'https://www.netflix.com/br/title/70195800',
		Pedro: 'https://www.primevideo.com/-/pt/detail/Chicago-PD/0LKRVK7S4XSF5OP4ZQW6F4OKY5',
		Maria: 'https://www.disneyplus.com/pt-br/browse/entity-95e7b2ce-5f45-4923-976d-b7e9968a7357',
		Evellyn: 'https://www.crunchyroll.com/pt-br/series/GG5H5XMWV/to-your-eternity'
	};

	// Salva o perfil escolhido com a chave esperada para o catalogo dinâmico.
	profileLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();

			const profileName = link.dataset.profile;
			const targetUrl = link.getAttribute('href') || 'catalogo.html';

			if (profileName) {
				entrarPerfil(profileName, targetUrl);
			}
		});
	});

	// Renderiza o catalogo dinamicamente quando estiver na pagina de home.
	const filmesContainer = document.getElementById('filmes');
	const seriesContainer = document.getElementById('series');
	const listaContainer = document.getElementById('lista');

	if (filmesContainer && seriesContainer && listaContainer) {
		const perfil = localStorage.getItem('perfil');
		const perfilAtivo = dados[perfil] ? perfil : 'Leticinha';
		const linkAssistir = linkAssistirPorPerfil[perfilAtivo] || linkAssistirPorPerfil.Leticinha;

		const heroProfile = document.getElementById('hero-profile');
		const hero = document.getElementById('inicio');

		if (heroProfile) {
			heroProfile.textContent = perfilAtivo;
		}

		if (profileImage) {
			const avatar = avatarPorPerfil[perfilAtivo] || 'capa1.avif';
			profileImage.src = `assets/${avatar}`;
			profileImage.alt = `Perfil ${perfilAtivo}`;
		}

		if (perfilAtual) {
			perfilAtual.textContent = perfilAtivo;
		}

		if (hero) {
			const banner = bannerPorPerfil[perfilAtivo] || `${perfilAtivo}.jpg`;
			hero.style.backgroundImage = `url("${encodeURI(`assets/banner/${banner}`)}")`;
		}

		if (assistirAgoraBtn) {
			assistirAgoraBtn.href = linkAssistir;
			assistirAgoraBtn.target = '_blank';
			assistirAgoraBtn.rel = 'noopener noreferrer';

			assistirAgoraBtn.addEventListener('click', (event) => {
				event.preventDefault();

				const openedWindow = window.open(linkAssistir, '_blank', 'noopener,noreferrer');

				if (!openedWindow) {
					window.location.assign(linkAssistir);
				}
			});
		}

		renderFilmes(filmesContainer, perfilAtivo, dados[perfilAtivo].filmes, 'filmes');
		renderFilmes(seriesContainer, perfilAtivo, dados[perfilAtivo].series, 'series');
		renderLista(listaContainer, perfilAtivo, dados[perfilAtivo].lista);
	}

	// Controla o menu mobile do catalogo.
	if (menuToggle) {
		menuToggle.addEventListener('click', () => {
			const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

			menuToggle.setAttribute('aria-expanded', String(!isExpanded));
			catalogBody.classList.toggle('nav-open');
		});
	}

	if (perfilTrigger && perfilHeader && perfilDropdown) {
		perfilTrigger.addEventListener('click', () => {
			const isOpen = perfilHeader.classList.toggle('open');

			perfilTrigger.setAttribute('aria-expanded', String(isOpen));
			perfilDropdown.setAttribute('aria-hidden', String(!isOpen));
		});

		document.addEventListener('click', (event) => {
			if (!perfilHeader.contains(event.target)) {
				perfilHeader.classList.remove('open');
				perfilTrigger.setAttribute('aria-expanded', 'false');
				perfilDropdown.setAttribute('aria-hidden', 'true');
			}
		});
	}

	if (trocarPerfilLink) {
		trocarPerfilLink.addEventListener('click', () => {
			localStorage.removeItem('perfil');
		});
	}

	if (gerenciarPerfisBtn) {
		gerenciarPerfisBtn.addEventListener('click', () => {
			alert('Gerenciamento de perfis em breve.');
		});
	}

	if (sairBtn) {
		sairBtn.addEventListener('click', () => {
			localStorage.removeItem('perfil');
			window.location.href = 'index.html';
		});
	}
});

function formatarTitulo(arquivo) {
	const termo = arquivo.replace(/\.[^/.]+$/, '');

	const nomeComEspacos = termo
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/(\d+)/g, ' $1')
		.replace(/[-_]+/g, ' ')
		.replace(/harrypotter/gi, 'harry potter')
		.replace(/\s+/g, ' ')
		.trim();

	return nomeComEspacos
		.toLowerCase()
		.replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function criarCard(src, titulo) {
	return `
		<article class="movie-card card" tabindex="0">
			<div class="movie-card-media">
				<img src="${encodeURI(src)}" alt="${titulo}" loading="lazy">
			</div>
			<p class="titulo">${titulo}</p>
		</article>
	`;
}

function renderFilmes(container, perfil, itens, tipo) {
	container.innerHTML = '';

	itens.forEach((arquivo) => {
		const titulo = formatarTitulo(arquivo);
		const caminho = `assets/${tipo}/${perfil}/${arquivo}`;

		container.innerHTML += criarCard(caminho, titulo);
	});
}

function renderLista(container, perfil, itens) {
	container.innerHTML = '';

	itens.forEach((item) => {
		const titulo = formatarTitulo(item.arquivo);
		const caminho = `assets/${item.tipo}/${perfil}/${item.arquivo}`;

		container.innerHTML += criarCard(caminho, titulo);
	});
}

function entrarPerfil(nome, destino) {
	document.body.classList.add('is-leaving');

	setTimeout(() => {
		localStorage.setItem('perfil', nome);
		window.location.href = destino;
	}, 400);
}
