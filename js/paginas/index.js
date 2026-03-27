import { obterPerfilAtivo } from '../components/perfil.js';

function iniciarIndex() {
	const perfilAtivo = obterPerfilAtivo();

	if (!perfilAtivo) {
		window.location.href = 'perfis.html';
		return;
	}

	window.location.href = 'catalogo.html';
}

document.addEventListener('DOMContentLoaded', iniciarIndex);
