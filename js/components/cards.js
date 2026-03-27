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

function escaparAtributo(valor) {
	return String(valor ?? '')
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function criarCard(src, titulo, item = {}) {
	const tipo = escaparAtributo(item.tipo);
	const arquivo = escaparAtributo(item.arquivo);
	const imagem = escaparAtributo(src);
	const tituloEscapado = escaparAtributo(titulo);

	return `
		<article class="movie-card card" tabindex="0" data-titulo="${tituloEscapado}" data-imagem="${imagem}" data-tipo="${tipo}" data-arquivo="${arquivo}">
			<div class="movie-card-media">
				<img src="${encodeURI(src)}" alt="${tituloEscapado}" loading="lazy">
				<button class="btn-add" type="button" aria-label="Adicionar ${tituloEscapado} à Minha Lista">+</button>
			</div>
			<p class="titulo">${titulo}</p>
		</article>
	`;
}

export function renderizarCards(container, perfil, itens, tipo) {
	if (!container) {
		return;
	}

	container.innerHTML = itens
		.map((arquivo) => {
			const titulo = formatarTitulo(arquivo);
			const caminho = `assets/${tipo}/${perfil}/${arquivo}`;
			return criarCard(caminho, titulo, { tipo, arquivo });
		})
		.join('');
}

export function renderizarLista(container, perfil, itens) {
	if (!container) {
		return;
	}

	container.innerHTML = itens
		.map((item) => {
			const titulo = item.titulo || formatarTitulo(item.arquivo);
			const caminho = item.imagem || `assets/${item.tipo}/${perfil}/${item.arquivo}`;
			return criarCard(caminho, titulo, item);
		})
		.join('');
}

export function renderizarResultadosExternos(container, itens) {
	if (!container) {
		return;
	}

	container.innerHTML = itens
		.map((item) => criarCard(item.imagem, item.titulo, item))
		.join('');
}

export function renderizarCardsLocais(container, itens) {
	if (!container) {
		return;
	}

	container.innerHTML = itens
		.map((item) => criarCard(item.imagem, item.titulo, item))
		.join('');
}
