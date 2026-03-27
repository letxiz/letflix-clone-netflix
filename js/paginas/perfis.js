import {
	obterPerfilAtivo,
	salvarPerfil,
	obterPerfisCollection,
	salvarPerfisCollection,
	adicionarPerfil,
	deletarPerfil,
	obterPerfilPorNome,
	atualizarPreferencias,
	AVATARES_DISPONIVEIS,
} from '../components/perfil.js';

let emModoGerenciamento = false;
let avatarSelecionado = null;
let nomePerfilPendente = null;

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
		
		const figura = document.createElement('figure');
		figura.innerHTML = `
			<img src="${perfil.avatar}" alt="Perfil ${perfil.nome}" loading="lazy" />
			<figcaption>${perfil.nome}</figcaption>
		`;
		
		const link = document.createElement('a');
		link.href = 'catalogo.html';
		link.className = 'profile-link';
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
			entrarPerfil(perfil.nome, 'catalogo.html');
		});
		
		grid.appendChild(li);
	});
}

function entrarPerfil(nome, destino) {
	document.body.classList.add('is-leaving');
	
	setTimeout(() => {
		salvarPerfil(nome);
		window.location.href = destino;
	}, 400);
}
function renderizarAvatarGrid() {
	const avatarGrid = document.getElementById('avatar-grid');
	
	if (!avatarGrid) return;
	
	avatarGrid.innerHTML = '';
	
	AVATARES_DISPONIVEIS.forEach((avatar) => {
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

function alternarModoGerenciamento() {
	emModoGerenciamento = !emModoGerenciamento;
	
	const body = document.body;
	const btn = document.getElementById('toggle-manage-btn');
	
	if (emModoGerenciamento) {
		body.classList.add('manage-mode');
		btn.classList.add('active');
		btn.textContent = 'Concluído';
	} else {
		body.classList.remove('manage-mode');
		btn.classList.remove('active');
		btn.textContent = 'Gerenciar perfis';
	}
}

function iniciarPaginaPerfis() {
	// Se houver perfil ativo, redirecionar
	const perfilAtivo = obterPerfilAtivo();
	if (perfilAtivo) {
		window.location.href = 'catalogo.html';
		return;
	}
	
	// Renderizar perfis
	renderizarPerfis();
	
	// Botão de gerenciar
	const manageBtn = document.getElementById('toggle-manage-btn');
	if (manageBtn) {
		manageBtn.addEventListener('click', alternarModoGerenciamento);
	}

	const addBtn = document.getElementById('open-add-profile-btn');
	if (addBtn) {
		addBtn.addEventListener('click', abrirModalAdicionarPerfil);
	}
	
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
