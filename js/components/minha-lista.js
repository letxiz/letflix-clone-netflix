const PREFIXO_MINHA_LISTA = 'minhaLista_';
const NOTIFICACOES_STORAGE_PREFIX = 'notificacoes_';

const ARQUIVOS_LEGADOS = {
	'HarryPotter1.jpg': 'Harry Potter 1.jpg',
	'HarryPotter2.jpg': 'Harry Potter 2.jpg',
	'HarryPotter3.jpg': 'Harry Potter 3.jpg',
	'Guerreirad.jpg': 'Guerreiras do Kpop.jpg',
	'Guerreiras do Kpop do Kpop.jpg': 'Guerreiras do Kpop.jpg',
	'TheOriginals.avf': 'The Originals.avf',
};

function aplicarCorrecoesLegadas(valor) {
	return String(valor || '')
		.replace(/HarryPotter1/gi, 'Harry Potter 1')
		.replace(/HarryPotter2/gi, 'Harry Potter 2')
		.replace(/HarryPotter3/gi, 'Harry Potter 3')
		.replace(/Guerreirad/gi, 'Guerreiras do Kpop')
		.replace(/Guerreiras do Kpop(\s+do Kpop)+/gi, 'Guerreiras do Kpop')
		.replace(/TheOriginals/gi, 'The Originals');
}

function normalizarArquivoLegado(arquivo) {
	const arquivoCorrigido = aplicarCorrecoesLegadas(arquivo);
	return ARQUIVOS_LEGADOS[arquivoCorrigido] || arquivoCorrigido || '';
}

function normalizarImagemLegada(imagem, tipo, arquivo) {
	if (!imagem) {
		return '';
	}

	let imagemNormalizada = imagem;

	Object.entries(ARQUIVOS_LEGADOS).forEach(([antigo, atual]) => {
		imagemNormalizada = imagemNormalizada.replace(antigo, atual);
	});

	imagemNormalizada = aplicarCorrecoesLegadas(imagemNormalizada);

	if (tipo && arquivo && imagemNormalizada.includes('/assets/')) {
		return imagemNormalizada;
	}

	return imagemNormalizada;
}

function normalizarTituloLegado(titulo, arquivoNormalizado) {
	const baseTitulo = !titulo || titulo === 'Sem titulo'
		? arquivoNormalizado.replace(/\.[^/.]+$/, '')
		: titulo;

	return baseTitulo
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/(\d+)/g, ' $1')
		.replace(/[-_]+/g, ' ')
		.replace(/HarryPotter/gi, 'Harry Potter')
		.replace(/TheOriginals/gi, 'The Originals')
		.replace(/Guerreirad/gi, 'Guerreiras do Kpop')
		.replace(/Guerreiras do Kpop(\s+do Kpop)+/gi, 'Guerreiras do Kpop')
		.replace(/\s+/g, ' ')
		.trim();
}

export function obterPerfilAtivoStorage() {
	try {
		const perfilAtivo = JSON.parse(localStorage.getItem('perfilAtivo') || 'null');
		return perfilAtivo && typeof perfilAtivo === 'object' ? perfilAtivo : null;
	} catch {
		return null;
	}
}

export function obterChaveMinhaLista(nomePerfil) {
	return `${PREFIXO_MINHA_LISTA}${nomePerfil}`;
}

export function obterIdentificadorMinhaLista(item) {
	return [
		item?.tipo || '',
		item?.arquivo || '',
		item?.imagem || '',
		item?.titulo || '',
	].join('|').toLowerCase();
}

function normalizarItemLista(item) {
	const arquivoNormalizado = normalizarArquivoLegado(item?.arquivo || '');
	const tipoNormalizado = item?.tipo || '';
	const imagemNormalizada = normalizarImagemLegada(item?.imagem || '', tipoNormalizado, arquivoNormalizado);
	const tituloNormalizado = normalizarTituloLegado(item?.titulo, arquivoNormalizado);

	return {
		titulo: tituloNormalizado || 'Sem titulo',
		imagem: imagemNormalizada,
		tipo: tipoNormalizado,
		arquivo: arquivoNormalizado,
		id: obterIdentificadorMinhaLista({
			titulo: tituloNormalizado || 'Sem titulo',
			imagem: imagemNormalizada,
			tipo: tipoNormalizado,
			arquivo: arquivoNormalizado,
		}),
	};
}

function lerListaSalva(nomePerfil) {
	if (!nomePerfil) {
		return [];
	}

	try {
		const dados = JSON.parse(localStorage.getItem(obterChaveMinhaLista(nomePerfil)) || '[]');
		const itensNormalizados = Array.isArray(dados) ? dados.map(normalizarItemLista) : [];

		if (Array.isArray(dados) && JSON.stringify(dados) !== JSON.stringify(itensNormalizados)) {
			salvarLista(nomePerfil, itensNormalizados);
		}

		return itensNormalizados;
	} catch {
		return [];
	}
}

function salvarLista(nomePerfil, itens) {
	if (!nomePerfil) {
		return;
	}

	localStorage.setItem(obterChaveMinhaLista(nomePerfil), JSON.stringify(itens.map(normalizarItemLista)));
}

function obterChaveNotificacoes(nomePerfil) {
	return `${NOTIFICACOES_STORAGE_PREFIX}${nomePerfil}`;
}

function lerNotificacoes(nomePerfil) {
	if (!nomePerfil) {
		return [];
	}

	try {
		const dados = JSON.parse(localStorage.getItem(obterChaveNotificacoes(nomePerfil)) || '[]');
		return Array.isArray(dados)
			? dados.filter((item) => typeof item === 'string' && item.trim() !== '')
			: [];
	} catch {
		return [];
	}
}

export function obterNotificacoes() {
	const perfilAtivo = obterPerfilAtivoStorage();
	const nomePerfil = perfilAtivo?.nome || '';
	return lerNotificacoes(nomePerfil);
}

export function adicionarNotificacao(texto, nomePerfil) {
	if (!texto || typeof texto !== 'string' || !nomePerfil) {
		return;
	}

	const notificacoes = lerNotificacoes(nomePerfil);
	notificacoes.unshift(texto.trim());
	const chave = obterChaveNotificacoes(nomePerfil);
	localStorage.setItem(chave, JSON.stringify(notificacoes));

	window.dispatchEvent(new CustomEvent('letflix:notificacoes-updated', {
		detail: { nomePerfil, chave, total: notificacoes.length }
	}));
}

function adicionarNaLista(nome, nomePerfil) {
	adicionarNotificacao(`${nome} foi adicionado à sua Lista`, nomePerfil);
}

function removerDaLista(nome, nomePerfil) {
	adicionarNotificacao(`${nome} foi removido da sua Lista`, nomePerfil);
}

export function obterMinhaListaPerfilAtivo(itensIniciais = []) {
	const perfilAtivo = obterPerfilAtivoStorage();
	const nomePerfil = perfilAtivo?.nome || '';
	if (!nomePerfil) {
		return [];
	}

	const listaSalva = lerListaSalva(nomePerfil);
	if (listaSalva.length > 0) {
		return listaSalva;
	}

	const listaInicial = itensIniciais.map(normalizarItemLista);
	if (listaInicial.length > 0) {
		salvarLista(nomePerfil, listaInicial);
	}

	return listaInicial;
}

export function adicionarMinhaLista(item, itensIniciais = []) {
	const perfilAtivo = obterPerfilAtivoStorage();
	const nomePerfil = perfilAtivo?.nome || '';
	if (!nomePerfil) {
		return { sucesso: false, motivo: 'perfil-invalido' };
	}

	const listaAtual = obterMinhaListaPerfilAtivo(itensIniciais);
	const itemNormalizado = normalizarItemLista(item);
	const jaExiste = listaAtual.some((listaItem) => listaItem.id === itemNormalizado.id);

	if (jaExiste) {
		return { sucesso: false, motivo: 'duplicado', lista: listaAtual };
	}

	const novaLista = [...listaAtual, itemNormalizado];
	salvarLista(nomePerfil, novaLista);

	return { sucesso: true, item: itemNormalizado, lista: novaLista };
}

export function removerMinhaLista(item, itensIniciais = []) {
	const perfilAtivo = obterPerfilAtivoStorage();
	const nomePerfil = perfilAtivo?.nome || '';
	if (!nomePerfil) {
		return { sucesso: false, motivo: 'perfil-invalido' };
	}

	const listaAtual = obterMinhaListaPerfilAtivo(itensIniciais);
	const itemNormalizado = normalizarItemLista(item);
	const novaLista = listaAtual.filter((listaItem) => listaItem.id !== itemNormalizado.id);

	if (novaLista.length === listaAtual.length) {
		return { sucesso: false, motivo: 'nao-encontrado', lista: listaAtual };
	}

	salvarLista(nomePerfil, novaLista);
	return { sucesso: true, item: itemNormalizado, lista: novaLista };
}

export function alternarMinhaLista(item, itensIniciais = []) {
	const perfilAtivo = obterPerfilAtivoStorage();
	const nomePerfil = perfilAtivo?.nome || '';
	const listaAtual = obterMinhaListaPerfilAtivo(itensIniciais);
	const itemNormalizado = normalizarItemLista(item);
	const jaExiste = listaAtual.some((listaItem) => listaItem.id === itemNormalizado.id);
	const nomeItem = itemNormalizado.titulo || 'item';

	if (jaExiste) {
		const resultado = removerMinhaLista(itemNormalizado, itensIniciais);
		if (resultado.sucesso) {
			removerDaLista(nomeItem, nomePerfil);
		}
		return { ...resultado, acao: 'removido' };
	}

	const resultado = adicionarMinhaLista(itemNormalizado, itensIniciais);
	if (resultado.sucesso) {
		adicionarNaLista(nomeItem, nomePerfil);
	}
	return { ...resultado, acao: 'adicionado' };
}