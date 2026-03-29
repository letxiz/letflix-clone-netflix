# 🎬 LETFLIX - Clone da Netflix

Projeto desenvolvido durante a **Imersão Front-End da Alura**, com o objetivo de recriar a interface da Netflix utilizando HTML, CSS e JavaScript.

---

## 🚀 Sobre o projeto

O **LETFLIX** é uma aplicação web inspirada na Netflix, que permite ao usuário selecionar perfis e navegar por um catálogo personalizado de filmes e séries.

Cada perfil possui conteúdos diferentes, simulando uma experiência real de streaming.

---

## ✨ Funcionalidades

- 👤 **Seleção de perfis:** Escolha entre diferentes usuários.
- 🧩 **Gerenciamento de perfis:** Acesso via dropdown para remover perfis.
- 🎬 **Catálogo dinâmico:** Conteúdo personalizado por usuário.
- 🎨 **Interface Fiel:** Design inspirado na UI original da Netflix.
- 🔄 **Navegação:** Transição suave entre páginas.
- 💾 **Persistência:** Uso de `localStorage` para salvar estados.
- ✨ **Interatividade:** Efeitos de hover e animações fluidas.
- 📱 **Responsividade:** Layout adaptável para diferentes dispositivos.
- 🔍 **Busca integrada:** Busca em tempo real usando API TMDB.
- 🎯 **Preferências por gênero:** Sistema de recomendação baseado em preferências do usuário.
- ➕➖ **Minha Lista interativa:** Adição e remoção de filmes/séries com um clique.
- 🛡️ **Fallback de imagem:** Cards exibem imagem padrão quando o carregamento falha.

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
│   └── series/
├── css/
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
├── index.html
├── perfis.html
├── README.md
└── style.css
```

## ✅ Atualizações recentes

- Ajustes de UX mobile em **busca** e **catálogo** (header, campo de busca e espaçamentos).
- Fluxo de **Gerenciar perfis** centralizado no dropdown com abertura em modo de gerenciamento.
- Botão **Adicionar perfil** reposicionado para melhor experiência em mobile e desktop.
- Limite de opções de avatar para novos perfis no mobile.
- Correções de títulos e caminhos de imagens legadas na **Minha Lista**.
- Suporte para **remover itens da Minha Lista** pelo mesmo botão de adicionar.
- Tratamento de fallback para evitar card com imagem quebrada.
- Correção no botão **Assistir agora** para evitar abertura duplicada: nova aba iniciada com `about:blank`, destino aplicado via `location.href` e fallback em `window.location.assign` quando necessário.

---

## Futuras Atualizações

O projeto está em evolução! Algumas melhorias planejadas incluem:

- 🌙 **Modo Claro/Escuro:** Toggle entre tema dark (atual) e light mode
- 📊 **Dashboard pessoal:** Histórico de visualizações e recomendações inteligentes
- 🔔 **Notificações:** Alertas de novos lançamentos por gênero favorito
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
