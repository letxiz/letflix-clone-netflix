# 🎬 LETFLIX - Clone da Netflix

Projeto desenvolvido durante a **Imersão Front-End da Alura**, com o objetivo de recriar a interface da Netflix utilizando HTML, CSS e JavaScript.

---

## 🚀 Sobre o projeto

O **LETFLIX** é uma aplicação web inspirada na Netflix, que permite ao usuário selecionar perfis e navegar por um catálogo personalizado de filmes e séries.

Cada perfil possui conteúdos diferentes, simulando uma experiência real de streaming.

---

## ✨ Funcionalidades

- 👤 **Seleção de perfis:** Escolha entre diferentes usuários.
- 🎬 **Catálogo dinâmico:** Conteúdo personalizado por usuário.
- 🎨 **Interface Fiel:** Design inspirado na UI original da Netflix.
- 🔄 **Navegação:** Transição suave entre páginas.
- 💾 **Persistência:** Uso de `localStorage` para salvar estados.
- ✨ **Interatividade:** Efeitos de hover e animações fluidas.
- 📱 **Responsividade:** Layout adaptável para diferentes dispositivos.
- 🔍 **Busca integrada:** Busca em tempo real usando API TMDB.
- 🎯 **Preferências por gênero:** Sistema de recomendação baseado em preferências do usuário.

---

## 🛠️ Tecnologias utilizadas

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **API TMDB** - Para busca de filmes e séries em tempo real

---

## 🔐 Integração com TMDB

O LETFLIX integra a **The Movie Database (TMDB) API** para busca dinâmica de filmes e séries em tempo real. A configuração segue boas práticas de segurança:

- `config.js`: contém a chave real (`TMDB_API_KEY`) e está no `.gitignore`
- `config.example.js`: arquivo modelo para referência (sem chave sensível)

**Como configurar:**
1. Obtenha uma chave gratuita em [TMDB](https://www.themoviedb.org/settings/api)
2. Copie `config.example.js` para `config.js`
3. Substitua `'COLOQUE_SUA_TMDB_API_KEY_AQUI'` pela sua chave real

---

## 📁 Estrutura do projeto

```bash
├── assets/
│   ├── banner/
│   ├── filmes/
│   └── series/
├── js/
│   ├── components/
│   │   ├── cards.js
│   │   ├── dropdown.js
│   │   └── perfil.js
│   ├── data/
│   │   ├── filmes.js
│   │   └── series.js
│   └── paginas/
│       ├── catalogo.js
│       └── index.js
├── index.html
├── catalogo.html
├── style.css
└── catalogo.css

```
## � Futuras Atualizações

O projeto está em evolução! Algumas melhorias planejadas incluem:

- 🌙 **Modo Claro/Escuro:** Toggle entre tema dark (atual) e light mode
- 📊 **Dashboard pessoal:** Histórico de visualizações e recomendações inteligentes
- 🔔 **Notificações:** Alertas de novos lançamentos por gênero favorito
- 🎬 **Reprodutor integrado:** Player nativo para conteúdo local
- 💬 **Avaliações e reviews:** Sistema de comentários entre usuários
- 🌐 **Mais integrações de API:** Suporte para outros provedores de dados

---

## � Desafios e Evolução

Este projeto foi uma jornada de aprendizado contínuo. Enfrentei desafios significativos, especialmente com:

- 🎨 **CSS:** Dinâmica de layouts responsivos, posicionamento avançado e animações fluidas foram complexos no início
- ⚙️ **JavaScript:** Manipulação do DOM, gerenciamento de estado com localStorage e integração de APIs exigiram muita prática

Mas estou **evoluindo constantemente**, melhorando meu código a cada commit e aplicando novos padrões. O projeto reflete esse crescimento! 🚀

---

## �📚 Aprendizados

Durante o desenvolvimento deste projeto, foram consolidados importantes conceitos de desenvolvimento front-end, como:

- Estruturação semântica de páginas com HTML  
- Estilização avançada e técnicas de posicionamento com CSS  
- Armazenamento de dados no navegador utilizando localStorage  
- Integração com APIs RESTful externas  
- Aplicação de boas práticas de segurança (variáveis de ambiente, .gitignore)  
- Aplicação de boas práticas de User Experience (UX)  
- Desenvolvimento de interfaces responsivas
- **Superação de desafios com JavaScript e DOM através da prática contínua**  
- **Evolução constante do código e aplicação de novos padrões**  

---

✨ Projeto desenvolvido com dedicação durante a Imersão Front-End da Alura.
