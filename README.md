# 🎬 LETFLIX - Clone da Netflix

Projeto desenvolvido durante a **Imersão Front-End da Alura**, com o objetivo de recriar a interface da Netflix utilizando HTML, CSS e JavaScript.

🔗 **[Ver demo ao vivo](https://letxiz.github.io/letflix-clone-netflix/)**

---

## 🚀 Sobre o projeto

O **LETFLIX** é uma aplicação web inspirada na Netflix, que permite ao usuário selecionar perfis e navegar por um catálogo personalizado de filmes e séries.

Cada perfil possui conteúdos diferentes, simulando uma experiência real de streaming.

---

## ✨ Funcionalidades

- 👤 **Seleção e criação de perfis:** Escolha entre perfis existentes ou crie um novo com nome e avatar.
- 🧩 **Gerenciamento de perfis:** Adicione e remova perfis diretamente no catálogo, com confirmação visual em modal.
- 🎬 **Intro animada:** Vídeo de abertura estilo Netflix ao entrar em um perfil, com botão "Pular intro" e controle por sessão.
- 🎞️ **Catálogo dinâmico:** Conteúdo personalizado por perfil com filmes e séries separados por gênero.
- 🔍 **Busca integrada:** Busca em tempo real usando a API TMDB.
- 🎯 **Preferências por gênero:** Recomendações baseadas nos gêneros favoritos de cada perfil.
- ➕➖ **Minha Lista interativa:** Adição e remoção de filmes/séries com feedback visual por notificação.
- 🔔 **Notificações por perfil:** Painel com histórico de ações, badge em tempo real e opção de limpar.
- 📱 **Responsividade:** Layout adaptável para desktop, tablet e mobile.
- 💾 **Persistência:** `localStorage` para dados permanentes e `sessionStorage` para estado de sessão.
- 🛡️ **Acessibilidade:** Skip links, regiões `aria-live`, foco gerenciado em modais e dropdowns, contraste e tamanhos de toque revisados.

---

## 🛠️ Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **API TMDB** - Para busca de filmes e séries em tempo real

---

## 🔐 Integração com TMDB

O LETFLIX integra a **The Movie Database (TMDB) API** para busca dinâmica de filmes e séries em tempo real.

Para manter compatibilidade com o **GitHub Pages**, a chave da API foi definida diretamente no arquivo principal da busca:

- `js/paginas/busca.js`: contém a constante `TMDB_API_KEY`
- A requisição usa `fetch` diretamente com a URL da API TMDB
- Há tratamento de erro no carregamento para facilitar debug no navegador

**Observação:** em projetos maiores, o ideal é esconder a chave no backend. Neste projeto front-end estático, a integração direta foi usada para garantir funcionamento no deploy online.

---

## 📁 Estrutura do projeto

```bash
.
├── assets/
│   ├── avatars/
│   ├── banner/
│   ├── filmes/
│   ├── generos/
│   ├── series/
│   ├── video/
│   │   └── intro-Letflix.mp4
│   ├── background.jpg
│   ├── capa1.avif
│   ├── capa3.jpg
│   └── capa4.avif
├── css/
│   ├── components/
│   │   └── header.css
│   ├── busca.css
│   ├── catalogo.css
│   └── perfis.css
├── js/
│   ├── components/
│   │   ├── cards.js
│   │   ├── dropdown.js
│   │   ├── minha-lista.js
│   │   └── perfil.js
│   ├── data/
│   │   ├── filmes.js
│   │   ├── generos.js
│   │   └── series.js
│   └── paginas/
│       ├── busca.js
│       ├── catalogo.js
│       ├── index.js
│       └── perfis.js
├── busca.html
├── catalogo.html
├── config.example.js
├── config.js
├── index.html
├── perfis.html
├── README.md
└── style.css
```

---

## ✅ Atualizações recentes

- Correção no botão **Assistir agora** para evitar abertura duplicada de abas.
- Correção no layout da busca com apenas 1 resultado (card gigante no desktop).
- **Intro animada** ao selecionar perfil com botão "Pular intro", controle por sessão/perfil e transição suave para o catálogo.
- **Botão "Pular intro" no mobile** centralizado horizontalmente, com largura adaptativa e ajuste para safe area em celulares.
- **Gerenciar perfis** diretamente no catálogo sem recarregar a página, com modal de confirmação e toast de feedback.
- **Notificações por perfil** com badge em tempo real, painel de histórico e botão para limpar.
- **Correção de responsividade da tela de perfis em mobile:** removido fallback agressivo em `max-width: 360px` que forçava 1 coluna em aparelhos como Galaxy S8+; grid ajustado para 2 colunas fluidas na maioria dos celulares e 1 coluna apenas em telas muito estreitas.
- **Header modularizado** em `css/components/header.css`.
- **Botão "Voltar" mobile** na busca, alinhado à direita, com fallback para o catálogo.
- **Auditoria de acessibilidade e responsividade:** 12 correções aplicadas (skip links, aria-live, foco em modais/dropdowns, tamanhos de toque, font-size mobile, entre outras).

---

## Futuras Atualizações

O projeto está em evolução! Algumas melhorias planejadas incluem:

- 🌙 **Modo Claro/Escuro:** Toggle entre tema dark (atual) e light mode
- 📊 **Dashboard pessoal:** Histórico de visualizações e recomendações inteligentes
- 🎬 **Reprodutor integrado:** Player nativo para conteúdo local
- 💬 **Avaliações e reviews:** Sistema de comentários entre usuários
- 🌐 **Mais integrações de API:** Suporte para outros provedores de dados

---

## Desafios e Evolução

Este projeto foi uma jornada de aprendizado contínuo. Enfrentei desafios significativos, especialmente com:

- 🎨 **CSS:** Dinâmica de layouts responsivos, posicionamento avançado e animações fluidas foram complexos no início
- ⚙️ **JavaScript:** Manipulação do DOM, gerenciamento de estado com localStorage e integração de APIs exigiram muita prática

Mas estou **evoluindo constantemente**, melhorando meu código a cada commit e aplicando novos padrões. O projeto reflete esse crescimento! 🚀

---

## 📚 Aprendizados

Durante o desenvolvimento deste projeto, foram consolidados importantes conceitos de desenvolvimento front-end, como:

- Estruturação semântica de páginas com HTML  
- Estilização avançada e técnicas de posicionamento com CSS  
- Armazenamento de dados no navegador utilizando localStorage  
- Integração com APIs RESTful externas  
- Compreensão dos limites de segurança em aplicações front-end estáticas  
- Aplicação de boas práticas de User Experience (UX)  
- Desenvolvimento de interfaces responsivas
- **Superação de desafios com JavaScript e DOM através da prática contínua**  
- **Evolução constante do código e aplicação de novos padrões**  

---

✨ Projeto desenvolvido com dedicação durante a Imersão Front-End da Alura.
