const PREFIXO_MINHA_LISTA = 'minhaLista_';

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
	return {
		titulo: item?.titulo || 'Sem titulo',
		imagem: item?.imagem || '',
		tipo: item?.tipo || '',
		arquivo: item?.arquivo || '',
		id: obterIdentificadorMinhaLista(item),
	};
}

function lerListaSalva(nomePerfil) {
	if (!nomePerfil) {
		return [];
	}

	try {
		const dados = JSON.parse(localStorage.getItem(obterChaveMinhaLista(nomePerfil)) || '[]');
		return Array.isArray(dados) ? dados.map(normalizarItemLista) : [];
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