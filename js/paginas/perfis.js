import {
	obterPerfilAtivo,
	salvarPerfil,
	obterPerfisCollection,
	adicionarPerfil,
	deletarPerfil,
	obterPerfilPorNome,
	atualizarPreferencias,
	AVATARES_DISPONIVEIS,
} from '../components/perfil.js';

let emModoGerenciamento = false;
let avatarSelecionado = null;
let nomePerfilPendente = null;
const mediaQueryMobile = window.matchMedia('(max-width: 768px)');
const LIMITE_AVATARES_MOBILE = 4;

const GENERO_LABELS = {
	acao: 'Ação',
	comedia: 'Comédia',
	terror: 'Terror',
	anime: 'Anime',
	romance: 'Romance',
};

const PERFIL_DESCRICOES = {
	Leticinha: 'Filmes e séries',
	Maria: 'Perfil infantil',
	Evellyn: 'Animes e fantasia',
};

function escaparHtml(valor) {
	return String(valor ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function obterItensResumoPerfil(perfil) {
	const preferencias = Array.isArray(perfil.preferencias) ? perfil.preferencias : [];
	const generos = preferencias
		.map((genero) => GENERO_LABELS[genero] || genero)
		.filter(Boolean)
		.slice(0, 2);

	if (generos.length > 0) {
		return generos;
	}

	return [PERFIL_DESCRICOES[perfil.nome] || 'Filmes e séries'];
}

function renderizarPerfis() {
	const perfis = obterPerfisCollection();
	const grid = document.getElementById('profiles-grid');
	
	if (!grid) return;
	
	grid.innerHTML = '';
	
	// Renderizar perfis existentes
	perfis.forEach((perfil, indice) => {
		const li = document.createElement('li');
		li.className = 'profile-item';
		li.style.animationDelay = `${indice * 0.08}s`;
		const resumoPerfil = obterItensResumoPerfil(perfil)
			.map((item) => `<li>${escaparHtml(item)}</li>`)
			.join('');
		
		const figura = document.createElement('figure');
		figura.innerHTML = `
			<img src="${perfil.avatar}" alt="Perfil ${escaparHtml(perfil.nome)}" loading="lazy" />
			<div class="profile-copy">
				<figcaption class="profile-name">${escaparHtml(perfil.nome)}</figcaption>
				<ul class="profile-meta" aria-label="Resumo do perfil ${escaparHtml(perfil.nome)}">${resumoPerfil}</ul>
			</div>
		`;
		
		const link = document.createElement('a');
		link.href = 'catalogo.html';
		link.className = 'profile-link';
		link.setAttribute('aria-label', `Entrar no perfil ${perfil.nome}`);
		link.appendChild(figura);
		
		// Botão de deletar
		const btnDelete = document.createElement('button');
		btnDelete.className = 'profile-delete-btn';
		btnDelete.innerHTML = '🗑️';
		btnDelete.setAttribute('aria-label', `Deletar perfil ${perfil.nome}`);
		btnDelete.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			confirmarDelecao(perfil.nome);
		});
		
		li.appendChild(link);
		li.appendChild(btnDelete);
		
		// Clique para selecionar
		link.addEventListener('click', (e) => {
			if (emModoGerenciamento) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			li.classList.add('is-selected');
			entrarPerfil(perfil.nome, 'catalogo.html');
		});
		
		grid.appendChild(li);
	});

	posicionarBotaoAdicionar();
}

function posicionarBotaoAdicionar() {
	const addBtn = document.getElementById('open-add-profile-btn');
	const grid = document.getElementById('profiles-grid');
	const actions = document.querySelector('.profiles-actions');
	const addAction = document.getElementById('profiles-add-action');

	if (!addBtn || !grid || !actions || !addAction) {
		return;
	}

	const itemExistente = grid.querySelector('.add-profile-entry');

	if (mediaQueryMobile.matches) {
		const itemAdicionar = itemExistente || document.createElement('li');
		itemAdicionar.className = 'profile-item add-profile-entry';
		itemAdicionar.appendChild(addBtn);

		if (!itemExistente) {
			grid.appendChild(itemAdicionar);
		}
		return;
	}

	if (itemExistente) {
		itemExistente.remove();
	}

	addAction.appendChild(addBtn);
}

function entrarPerfil(nome, destino) {
	document.body.classList.add('is-leaving');
	
	setTimeout(() => {
		salvarPerfil(nome);
		window.location.href = destino;
	}, 400);
}

function obterAvataresDisponiveis() {
	if (mediaQueryMobile.matches) {
		return AVATARES_DISPONIVEIS.slice(0, LIMITE_AVATARES_MOBILE);
	}

	return AVATARES_DISPONIVEIS;
}

function renderizarAvatarGrid() {
	const avatarGrid = document.getElementById('avatar-grid');
	
	if (!avatarGrid) return;
	
	avatarGrid.innerHTML = '';

	const avataresDisponiveis = obterAvataresDisponiveis();

	if (avatarSelecionado && !avataresDisponiveis.includes(avatarSelecionado)) {
		avatarSelecionado = null;
	}
	
	avataresDisponiveis.forEach((avatar) => {
		const div = document.createElement('div');
		div.className = 'avatar-option';
		if (avatarSelecionado === avatar) {
			div.classList.add('selected');
		}
		
		const img = document.createElement('img');
		img.src = avatar;
		img.alt = `Avatar opção`;
		img.loading = 'lazy';
		
		div.appendChild(img);
		
		div.addEventListener('click', () => {
			// Remover selected de todos
			document.querySelectorAll('.avatar-option').forEach(opt => {
				opt.classList.remove('selected');
			});
			
			// Adicionar selected ao clicado
			div.classList.add('selected');
			avatarSelecionado = avatar;
		});
		
		avatarGrid.appendChild(div);
	});
}
function abrirModalAdicionarPerfil() {
	const modal = document.getElementById('add-profile-modal');
	const input = document.getElementById('profile-input');
	
	if (!modal || !input) return;
	
	// Renderizar grid de avatares
	renderizarAvatarGrid();
	
	modal.classList.add('active');
	input.focus();
	input.value = '';
	avatarSelecionado = null;
	limparMensagemModal();
	atualizarBotaoConfirmar();
}

function fecharModal() {
	const modal = document.getElementById('add-profile-modal');
	if (modal) {
		modal.classList.remove('active');
		document.getElementById('profile-input').value = '';
		avatarSelecionado = null;
		limparMensagemModal();
	}
}

function limparMensagemModal() {
	const msgElement = document.getElementById('modal-message');
	if (msgElement) {
		msgElement.textContent = '';
		msgElement.style.color = '';
	}
}

function exibirMensagem(texto, tipo = 'erro') {
	const msgElement = document.getElementById('modal-message');
	if (msgElement) {
		msgElement.textContent = texto;
		msgElement.style.color = tipo === 'sucesso' ? '#4ade80' : '#ef4444';
	}
}

function atualizarBotaoConfirmar() {
	const input = document.getElementById('profile-input');
	const confirmBtn = document.getElementById('confirm-btn');
	
	if (input && confirmBtn) {
		const temConteudo = input.value.trim().length > 0;
		confirmBtn.disabled = !temConteudo;
	}
}

function confirmarNovoPerf() {
	const input = document.getElementById('profile-input');
	const nome = input.value.trim();
	
	if (!nome) {
		exibirMensagem('Digite um nome para o perfil', 'erro');
		return;
	}
	
	const resultado = adicionarPerfil(nome, avatarSelecionado);
	
	if (resultado.sucesso) {
		nomePerfilPendente = nome;
		fecharModal();
		abrirModalPreferencias();
	} else {
		exibirMensagem(resultado.mensagem, 'erro');
	}
}

// ============================================
// MODAL DE PREFERÊNCIAS (ETAPA 2)
// ============================================

function abrirModalPreferencias() {
	const modal = document.getElementById('preferences-modal');
	if (!modal) return;

	// Reset selection
	modal.querySelectorAll('.genre-chip').forEach(chip => chip.classList.remove('selected'));
	modal.classList.add('active');
}

function fecharModalPreferencias() {
	const modal = document.getElementById('preferences-modal');
	if (modal) modal.classList.remove('active');
}

function entrarComPerfil() {
	if (!nomePerfilPendente) return;

	const generosSelecionados = [];
	document.querySelectorAll('#genres-grid .genre-chip.selected').forEach(chip => {
		generosSelecionados.push(chip.dataset.genre);
	});

	if (generosSelecionados.length > 0) {
		atualizarPreferencias(nomePerfilPendente, generosSelecionados);
	}

	fecharModalPreferencias();
	entrarPerfil(nomePerfilPendente, 'catalogo.html');
}

function confirmarDelecao(nome) {
	const confirmar = confirm(`Tem certeza que deseja deletar o perfil "${nome}"?`);
	
	if (confirmar) {
		const resultado = deletarPerfil(nome);
		
		if (resultado.sucesso) {
			renderizarPerfis();
		} else {
			alert('Erro ao deletar perfil: ' + resultado.mensagem);
		}
	}
}

function aplicarModoGerenciamento(ativo) {
	emModoGerenciamento = ativo;

	const body = document.body;
	const titulo = document.getElementById('profiles-title');
	const helperText = document.getElementById('profiles-helper-text');
	
	if (emModoGerenciamento) {
		body.classList.add('manage-mode');
		if (titulo) {
			titulo.textContent = 'Gerenciar perfis';
		}
		if (helperText) {
			helperText.hidden = false;
		}
	} else {
		body.classList.remove('manage-mode');
		if (titulo) {
			titulo.textContent = 'Escolha um perfil';
		}
		if (helperText) {
			helperText.hidden = true;
		}
	}
}

function iniciarPaginaPerfis() {
	const params = new URLSearchParams(window.location.search);
	const abriuModoGerenciamento = params.get('modo') === 'gerenciar';

	// Se houver perfil ativo, redirecionar
	const perfilAtivo = obterPerfilAtivo();
	if (perfilAtivo && !abriuModoGerenciamento) {
		window.location.href = 'catalogo.html';
		return;
	}
	
	// Renderizar perfis
	renderizarPerfis();

	if (abriuModoGerenciamento) {
		aplicarModoGerenciamento(true);
	}

	const addBtn = document.getElementById('open-add-profile-btn');
	if (addBtn) {
		addBtn.addEventListener('click', abrirModalAdicionarPerfil);
	}

	posicionarBotaoAdicionar();
	mediaQueryMobile.addEventListener('change', () => {
		posicionarBotaoAdicionar();

		const modalAdicionar = document.getElementById('add-profile-modal');
		if (modalAdicionar?.classList.contains('active')) {
			renderizarAvatarGrid();
		}
	});
	
	// Modal eventos
	const modal = document.getElementById('add-profile-modal');
	const input = document.getElementById('profile-input');
	const confirmBtn = document.getElementById('confirm-btn');
	const cancelBtn = document.getElementById('cancel-btn');
	
	if (input) {
		input.addEventListener('input', atualizarBotaoConfirmar);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !confirmBtn.disabled) {
				confirmarNovoPerf();
			} else if (e.key === 'Escape') {
				fecharModal();
			}
		});
	}
	
	if (confirmBtn) {
		confirmBtn.addEventListener('click', confirmarNovoPerf);
	}
	
	if (cancelBtn) {
		cancelBtn.addEventListener('click', fecharModal);
	}
	
	// Fechar modal ao clicar fora
	if (modal) {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				fecharModal();
			}
		});
	}

	// Modal de preferências
	const prefModal = document.getElementById('preferences-modal');
	const prefConfirmBtn = document.getElementById('pref-confirm-btn');
	const prefSkipBtn = document.getElementById('pref-skip-btn');

	if (prefConfirmBtn) {
		prefConfirmBtn.addEventListener('click', entrarComPerfil);
	}

	if (prefSkipBtn) {
		prefSkipBtn.addEventListener('click', entrarComPerfil);
	}

	if (prefModal) {
		document.querySelectorAll('#genres-grid .genre-chip').forEach(chip => {
			chip.addEventListener('click', () => chip.classList.toggle('selected'));
		});
	}
}

document.addEventListener('DOMContentLoaded', iniciarPaginaPerfis);
