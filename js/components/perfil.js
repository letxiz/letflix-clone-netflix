const PERFIL_STORAGE_KEY = 'perfilAtivo';
const PERFIL_STORAGE_LEGACY_KEY = 'perfil';
const PERFIS_COLLECTION_KEY = 'perfis';
const PERFIL_PADRAO = 'Leticinha';
const MAX_PERFIS = 5;
const BANNER_PADRAO = 'assets/background/banner1.jpg';
const PERFIS_REMOVIDOS = new Set(['Pedro']);
const AVATARES_DISPONIVEIS = [
	'assets/avatars/avatar1.jpg',
	'assets/avatars/avatar2.jpg',
	'assets/avatars/avatar3.jpg',
	'assets/avatars/avatar4.jpg',
	'assets/avatars/avatar5.jpg',
	'assets/avatars/avatar6.jpg',
	'assets/avatars/avatar7.jpg',
	'assets/avatars/avatar8.jpg',
	'assets/avatars/avatar9.jpg',
	'assets/avatars/avatar10.jpg',
];

const PERFIS_PADRAO = [
	{ nome: 'Leticinha', avatar: 'assets/capa1.avif', preferencias: [], banner: BANNER_PADRAO },
	{ nome: 'Maria', avatar: 'assets/capa3.jpg', preferencias: [], banner: BANNER_PADRAO },
	{ nome: 'Evellyn', avatar: 'assets/capa4.avif', preferencias: [], banner: BANNER_PADRAO },
];

function obterAvatarPadraoPorNome(nome) {
	const perfil = PERFIS_PADRAO.find((item) => item.nome === nome);
	return perfil ? perfil.avatar : null;
}

function normalizarCaminhoAvatar(perfil) {
	if (!perfil || !perfil.nome) {
		return perfil;
	}

	const avatarPadrao = obterAvatarPadraoPorNome(perfil.nome);
	if (avatarPadrao) {
		return { ...perfil, avatar: avatarPadrao };
	}

	const avatarAtual = typeof perfil.avatar === 'string' ? perfil.avatar : '';
	const match = avatarAtual.match(/avatar(\d+)\.(svg|png|jpg)$/i);

	if (match) {
		return { ...perfil, avatar: `assets/avatars/avatar${match[1]}.jpg` };
	}

	return {
		...perfil,
		avatar: avatarAtual || AVATARES_DISPONIVEIS[0],
	};
}

function normalizarPerfil(perfil) {
	if (!perfil || !perfil.nome) {
		return perfil;
	}

	const perfilComAvatar = normalizarCaminhoAvatar(perfil);

	return {
		...perfilComAvatar,
		preferencias: Array.isArray(perfilComAvatar.preferencias) ? perfilComAvatar.preferencias : [],
		banner: typeof perfilComAvatar.banner === 'string' && perfilComAvatar.banner.trim() !== ''
			? perfilComAvatar.banner
			: BANNER_PADRAO,
	};
}

function perfilFoiRemovido(nome) {
	return PERFIS_REMOVIDOS.has(nome);
}

function obterPerfilPadrao() {
	for (const perfilPadrao of PERFIS_PADRAO) {
		if (perfilPadrao) {
			return normalizarPerfil(perfilPadrao);
		}
	}

	return null;
}

function obterPrimeiroPerfilDaColecao() {
	const perfis = obterPerfisCollection();
	for (const perfil of perfis) {
		if (perfil && perfil.nome) {
			return normalizarPerfil(perfil);
		}
	}

	return null;
}

function encontrarPerfilPorNome(nome) {
	if (!nome) {
		return null;
	}

	const perfis = obterPerfisCollection();
	const perfil = perfis.find((p) => p.nome === nome);
	return perfil ? normalizarPerfil(perfil) : null;
}

function obterPerfilPersistido() {
	const perfilNovo = localStorage.getItem(PERFIL_STORAGE_KEY);
	const perfilLegacy = localStorage.getItem(PERFIL_STORAGE_LEGACY_KEY);

	if (perfilNovo) {
		try {
			const perfilParseado = JSON.parse(perfilNovo);

			if (perfilParseado && typeof perfilParseado === 'object' && perfilParseado.nome) {
				return normalizarPerfil(perfilParseado);
			}

			if (typeof perfilParseado === 'string') {
				return encontrarPerfilPorNome(perfilParseado) || null;
			}
		} catch {
			// Compatibilidade com versões antigas onde o valor era apenas o nome.
			return encontrarPerfilPorNome(perfilNovo) || null;
		}
	}

	if (perfilLegacy) {
		const perfilConvertido = encontrarPerfilPorNome(perfilLegacy) || null;
		if (perfilConvertido) {
			localStorage.setItem(PERFIL_STORAGE_KEY, JSON.stringify(perfilConvertido));
		}
		return perfilConvertido;
	}

	return null;
}

export function salvarPerfil(perfilOuNome) {
	if (!perfilOuNome) {
		return;
	}

	let perfilNormalizado = null;

	if (typeof perfilOuNome === 'object' && perfilOuNome.nome) {
		perfilNormalizado = normalizarPerfil(perfilOuNome);
	} else if (typeof perfilOuNome === 'string') {
		perfilNormalizado = encontrarPerfilPorNome(perfilOuNome)
			|| normalizarPerfil({ nome: perfilOuNome, avatar: AVATARES_DISPONIVEIS[0], preferencias: [], banner: BANNER_PADRAO });
	}

	if (!perfilNormalizado) {
		return;
	}

	localStorage.setItem(PERFIL_STORAGE_KEY, JSON.stringify(perfilNormalizado));
}

export function obterPerfil(perfisDisponiveis = []) {
	const perfilSalvo = obterPerfilPersistido();

	if (Array.isArray(perfisDisponiveis) && perfisDisponiveis.length > 0) {
		if (perfilSalvo && perfisDisponiveis.includes(perfilSalvo.nome)) {
			return perfilSalvo;
		}

		const perfilDaColecao = obterPerfisCollection().find((perfil) => perfisDisponiveis.includes(perfil.nome));
		return perfilDaColecao || obterPrimeiroPerfilDaColecao() || obterPerfilPadrao();
	}

	return perfilSalvo || obterPrimeiroPerfilDaColecao() || obterPerfilPadrao();
}

export function obterPerfilAtivo() {
	const perfil = obterPerfilPersistido();

	if (perfil && perfilFoiRemovido(perfil.nome)) {
		limparPerfil();
		return null;
	}

	return perfil;
}

export function garantirPerfilAtivo(redirectUrl = 'perfis.html') {
	const perfil = obterPerfilPersistido();

	if (!perfil) {
		window.location.href = redirectUrl;
		return null;
	}

	return perfil;
}

export function limparPerfil() {
	localStorage.removeItem(PERFIL_STORAGE_KEY);
	localStorage.removeItem(PERFIL_STORAGE_LEGACY_KEY);
}

// ============================================
// SISTEMA DE GERENCIAMENTO DE COLEÇÃO DE PERFIS
// ============================================

export function obterPerfisCollection() {
	const perfisJSON = localStorage.getItem(PERFIS_COLLECTION_KEY);
	
	if (!perfisJSON) {
		// Inicializar com perfis padrão se não existirem
		const perfispadrao = [...PERFIS_PADRAO];
		salvarPerfisCollection(perfispadrao);
		return perfispadrao;
	}
	
	try {
		const perfisLidos = JSON.parse(perfisJSON);

		if (!Array.isArray(perfisLidos)) {
			return [];
		}

		const perfisNormalizados = perfisLidos
			.map(normalizarPerfil)
			.filter((perfil) => perfil && !perfilFoiRemovido(perfil.nome));

		if (JSON.stringify(perfisLidos) !== JSON.stringify(perfisNormalizados)) {
			salvarPerfisCollection(perfisNormalizados);

			const perfilAtivo = obterPerfilPersistido();
			if (perfilAtivo && perfilFoiRemovido(perfilAtivo.nome)) {
				limparPerfil();
			}
		}

		return perfisNormalizados;
	} catch (e) {
		console.error('Erro ao parsear perfis:', e);
		return [];
	}
}

export function salvarPerfisCollection(perfis) {
	if (!Array.isArray(perfis)) {
		console.error('Perfis deve ser um array');
		return false;
	}
	
	localStorage.setItem(PERFIS_COLLECTION_KEY, JSON.stringify(perfis));
	return true;
}

export function escolherAvatarAleatorio(perfisExistentes = []) {
	const avataresBloqueados = new Set(perfisExistentes.map(p => p.avatar));
	const avataresCandidatos = AVATARES_DISPONIVEIS.filter(a => !avataresBloqueados.has(a));
	
	if (avataresCandidatos.length === 0) {
		// Se todos foram usados, devolver um aleatório da lista completa
		return AVATARES_DISPONIVEIS[Math.floor(Math.random() * AVATARES_DISPONIVEIS.length)];
	}
	
	return avataresCandidatos[Math.floor(Math.random() * avataresCandidatos.length)];
}

export function adicionarPerfil(nome, avatarSelecionado = null) {
	if (!nome || nome.trim() === '') {
		return { sucesso: false, mensagem: 'Nome não pode ser vazio' };
	}
	
	const perfis = obterPerfisCollection();
	
	if (perfis.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
		return { sucesso: false, mensagem: 'Perfil com este nome já existe' };
	}
	
	// Usar avatar selecionado ou escolher um aleatório
	const novoAvatar = avatarSelecionado || escolherAvatarAleatorio(perfis);
	const novoPerfil = {
		nome: nome.trim(),
		avatar: novoAvatar,
		preferencias: [],
		banner: BANNER_PADRAO,
	};
	
	perfis.push(novoPerfil);
	salvarPerfisCollection(perfis);
	
	return { sucesso: true, perfil: novoPerfil };
}

export function deletarPerfil(nome) {
	const perfis = obterPerfisCollection();
	const indice = perfis.findIndex(p => p.nome === nome);
	
	if (indice === -1) {
		return { sucesso: false, mensagem: 'Perfil não encontrado' };
	}
	
	// Se é o perfil ativo, remover o ativo também
	if (obterPerfilAtivo()?.nome === nome) {
		limparPerfil();
	}
	
	perfis.splice(indice, 1);
	salvarPerfisCollection(perfis);
	
	return { sucesso: true, mensagem: 'Perfil deletado' };
}

export function obterPerfilPorNome(nome) {
	const perfis = obterPerfisCollection();
	return perfis.find(p => p.nome === nome) || null;
}

export function atualizarPreferencias(nome, preferencias) {
	if (!nome || !Array.isArray(preferencias)) return false;

	const perfis = obterPerfisCollection();
	const indice = perfis.findIndex(p => p.nome === nome);

	if (indice === -1) return false;

	perfis[indice] = { ...perfis[indice], preferencias };
	salvarPerfisCollection(perfis);
	return true;
}

export { AVATARES_DISPONIVEIS };
