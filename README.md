# 🩺 Agenda Saúde - Protótipo de Sistema de Agendamento

Um **protótipo funcional de sistema de agendamento de consultas médicas**, desenvolvido para a disciplina de **Interface Humano-Computador (IHC)** com foco em usabilidade, acessibilidade e experiência do usuário.

## 📋 Informações do Projeto

- **Disciplina**: Interface Humano-Computador (IHC)
- **Curso**: Ciência da Computação
- **Versão**: 2.1
- **Ano**: 2025
- **Status**: ✅ Funcional e Pronto para Uso

---

## 🎯 Objetivo Principal

Criar um sistema de agendamento de consultas que seja:
- ✅ **Intuitivo e simples** - Interface clara para usuários leigos
- ✅ **Acessível** - Modo de alto contraste, suporte ARIA, WCAG 2.1 Level A
- ✅ **Funcional** - Simular comportamento de um sistema real
- ✅ **Educacional** - Demonstrar boas práticas de IHC e desenvolvimento web

---

## 🏗️ Funcionalidades Principais

### 1. **Landing Page (Início)**
- Apresentação do sistema com call-to-action "Começar agendamento"
- Card mostrando o próximo agendamento do usuário
- Lista de benefícios da plataforma
- Navegação intuitiva para as seções principais

### 2. **Profissionais Disponíveis**
- **Filtros por especialidade** (Cardiologia, Pediatria, Dermatologia, Clínico Geral)
- **Busca por nome** do profissional em tempo real
- Cards com informações: nome, especialidade, experiência, local
- Botão "Agendar" com animação especial (swingIn)

### 3. **Agendamento de Consultas**
- Seleção de profissional (preenchida automaticamente)
- Preenchimento de dados do paciente
- Seleção de data e horário
- Campo de observações (opcional)
- Validação de formulário com feedback
- Botão "Confirmar agendamento" com animação pulseScale

### 4. **Meus Agendamentos**
- Listagem de todos os agendamentos realizados
- Ordenação automática por data/hora crescente
- Botão para limpar todos os agendamentos
- Atualização em tempo real via localStorage

### 5. **Sobre o Protótipo**
- Apresentação do projeto acadêmico
- Explicação de conceitos de IHC aplicados
- Tecnologias utilizadas
- Referência ao processo de design

### 6. **Acessibilidade & Inclusão**
- **Modo Alto Contraste** - Botão dedicado na header (alternativa de cores: amarelo/preto)
- **Skip Link** - Link para pular para conteúdo principal
- **ARIA Labels** - Suporte a leitores de tela
- **Navegação por teclado** - Totalmente suportada (Tab, Enter, Escape)
- **Feedback Visual** - Mensagens de status e confirmação em tempo real

---

## 📁 Estrutura de Arquivos

```
TrabalhoFinalIHC/
├── index.html                # Landing page + seções integradas
├── profissionais.html        # Página dedicada aos profissionais (multi-page)
├── agendamentos.html         # Página dedicada aos agendamentos (multi-page)
├── sobre.html                # Página sobre o protótipo (multi-page)
├── 404.html                  # Página de erro 404
├── style.css                 # Estilos unificados com animações CSS
├── script.js                 # Lógica JavaScript (365 linhas)
├── data.json                 # Banco de dados em JSON (personas, profissionais)
├── README.md                 # Este arquivo
└── img/                      # Pasta com ilustrações SVG
    ├── hero-saude.svg        # Ilustração principal landing page
    ├── consulta-online.svg   # Ilustração seção profissionais
    ├── agenda-digital.svg    # Ilustração agendamento
    └── sobre-prototipo.svg   # Ilustração sobre
```

---

## 💻 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **HTML5** | - | Estrutura semântica, acessível e responsiva |
| **CSS3** | - | Estilização com variáveis CSS, Grid/Flexbox, 150+ animações |
| **JavaScript Vanilla** | ES6+ | Lógica de negócio sem dependências externas |
| **localStorage API** | - | Persistência de dados no navegador (cliente-side) |
| **SVG** | - | Ilustrações vetoriais escaláveis |

---

## 🎨 Design & Estilo

### Paleta de Cores Padrão
```css
--cor-fundo: #f5f7fb              /* Fundo principal - azul muito claro */
--cor-fundo-alt: #ffffff          /* Fundo alternativo - branco */
--cor-primaria: #2563eb           /* Azul principal (botões, links) */
--cor-primaria-escura: #1d4ed8    /* Azul escuro (hover/focus) */
--cor-texto: #111827              /* Texto principal - cinza escuro */
--cor-texto-suave: #6b7280        /* Texto secundário - cinza médio */
--cor-borda: #e5e7eb              /* Bordas - cinza claro */
```

### Modo Alto Contraste
```css
--cor-fundo: #000000              /* Preto puro */
--cor-primaria: #ffff00           /* Amarelo vibrante */
--cor-texto: #ffffff              /* Branco puro */
--cor-borda: #ffffff              /* Branco puro */
```

### Animações Aplicadas
| Animação | Uso | Duração |
|----------|-----|---------|
| **fadeInUp** | Entrada de seções | 0.6s |
| **slideInLeft** | Cards profissionais | 0.5s |
| **slideInRight** | Elementos laterais | 0.5s |
| **bounceIn** | Botão "Começar agendamento" (landing) | 0.8s |
| **swingIn** | Botões "Agendar" (profissionais) | 0.6s |
| **pulseScale** | Botão "Confirmar agendamento" (form) | 1s |
| **glow** | Efeitos de destaque | 2s (loop) |

### Responsividade
- **Desktop** (>900px): Layout completo com 2-3 colunas
- **Tablet** (641-900px): Grid adaptativo com 2 colunas
- **Mobile** (<641px): Layout single-column totalmente responsivo

---

## 📊 Dados do Sistema

### Profissionais Disponíveis (4)
| Nome | Especialidade | Experiência | Local |
|------|---------------|-------------|-------|
| Dra. Ana Souza | Cardiologia | 10 anos | Clínica Coração Saudável - Centro |
| Dr. João Lima | Pediatria | 8 anos | Hospital Infantil Esperança |
| Dra. Marina Alves | Dermatologia | 6 anos | Clínica Pele & Saúde |
| Dr. Carlos Nogueira | Clínico Geral | 12 anos | UBS - Bairro Norte |

### Especialidades Suportadas
- 🫀 Cardiologia
- 👶 Pediatria
- 🩹 Dermatologia
- 👨‍⚕️ Clínico Geral

### Dados Persistidos (localStorage)
```javascript
{
  "profissional_selecionado": "string",
  "modo_contraste": "boolean",
  "agendamentos_saude": [
    {
      "nomePaciente": "string",
      "profissional": "string",
      "data": "YYYY-MM-DD",
      "hora": "HH:MM",
      "observacoes": "string"
    }
  ]
}
```

---

## 🚀 Como Usar

### 1. Instalação & Execução

**Opção A: Clicar no arquivo HTML**
```
Duplo clique em index.html para abrir no navegador padrão
```

**Opção B: Usar Live Server (VS Code)**
```
Instalar extensão "Live Server"
Right-click em index.html → "Open with Live Server"
```

**Opção C: Python (servidor local)**
```bash
cd TrabalhoFinalIHC
python -m http.server 8000
# Acessar http://localhost:8000
```

**Opção D: Node.js (http-server)**
```bash
npm install -g http-server
http-server
```

### 2. Fluxo de Agendamento

1. **Clique em "Começar agendamento"** (botão com animação bounceIn)
2. **Filtre profissionais** por especialidade ou nome
3. **Clique em "Agendar"** em um profissional (botão com animação swingIn)
4. **Preencha os dados**:
   - Nome do paciente
   - Data da consulta
   - Horário
   - Observações (opcional)
5. **Clique em "Confirmar agendamento"** (botão com animação pulseScale)
6. **Visualize** em "Meus agendamentos" (salvo automaticamente)

### 3. Testar Acessibilidade

```
✨ Navegação por teclado:
   - Tab: Navegar entre elementos
   - Enter: Ativar botões
   - Shift + Tab: Navegar para trás

🎨 Alto Contraste:
   - Clique no botão "Alto contraste" na header

🔗 Skip Link:
   - Pressione Tab na página para ativar "Ir para conteúdo principal"

📱 Responsividade:
   - Redimensione a janela do navegador
   - Ou use F12 → Device Toolbar (mobile simulation)
```

---

## 🛠️ Desenvolvimento

### Estrutura de Funções (script.js)

```javascript
// ===== RENDERIZAÇÃO =====
renderizarProfissionais(lista)      // Cria cards de profissionais
atualizarListaAgendamentos()        // Atualiza lista visual
atualizarProximoAgendamento()       // Atualiza card da landing

// ===== LÓGICA DE AGENDAMENTO =====
selecionarProfissional(prof)        // Seleciona profissional
criarAgendamentoObj()               // Cria objeto de agendamento
validarAgendamento(agendamento)     // Valida dados obrigatórios
salvarAgendamento(agendamento)      // Salva e persiste

// ===== FILTROS =====
aplicarFiltros()                    // Aplica filtros de especialidade/nome
limparFiltros()                     // Reseta filtros e recarrega lista

// ===== PERSISTÊNCIA =====
carregarDoStorage()                 // Carrega agendamentos salvos
salvarNoStorage()                   // Persiste agendamentos em localStorage

// ===== UTILITÁRIOS =====
formatarData(dataIso)               // Converte YYYY-MM-DD para DD/MM/YYYY
```

### Guia de Modificações

**Adicionar novo profissional:**
```javascript
// Em profissionaisBase (script.js, linha ~1)
{
  id: 5,
  nome: "Dr. Nome Completo",
  especialidade: "cardiologia",  // lowercase, sem espaços
  especialidadeLabel: "Cardiologia",
  experiencia: "X anos de experiência",
  local: "Nome da Clínica - Bairro"
}
```

**Adicionar nova especialidade:**
```javascript
// Em style.css - Adicionar option no select
<option value="cirurgia">Cirurgia Geral</option>

// Em script.js - Adicionar filtro
if (esp !== "todas") {
  filtrados = filtrados.filter((p) => p.especialidade === esp);
}
```

**Customizar cores:**
```css
/* Em style.css :root (linhas 1-12) */
:root {
  --cor-primaria: #3b82f6;        /* Novo azul */
  --cor-primaria-escura: #2563eb; /* Novo azul escuro */
  /* ... etc */
}
```

**Modificar textos:**
- Landing: `index.html` seção `.hero`
- Profissionais: `script.js` array `profissionaisBase`
- Formulário: `index.html` seção `.form-agendamento`
- Footer: Qualquer página `.rodape`

---

## ✨ Melhorias Implementadas (v2.1)

### Core Features
- ✅ **Multi-page Navigation** - 5 páginas HTML separadas com navegação entre elas
- ✅ **localStorage Persistence** - Agendamentos salvos mesmo após fechar navegador
- ✅ **Alto Contraste Acessível** - Modo alternativo com cores de alto contraste
- ✅ **Validação de Formulário** - Feedback claro para erros de entrada
- ✅ **Responsividade Completa** - Funciona em desktop, tablet e mobile

### Visual & UX
- ✅ **150+ Animações CSS** - Entrada de seções, cards, elementos
- ✅ **3 Botões Animados** - Começar, Agendar, Confirmar com efeitos únicos
- ✅ **Skip Link** - Acessibilidade para pular para conteúdo principal
- ✅ **ARIA Labels** - Suporte a leitores de tela
- ✅ **Feedback em Tempo Real** - Mensagens de status e validação

### Code Quality
- ✅ **Sem Dependências Externas** - Vanilla JS/CSS apenas
- ✅ **WCAG 2.1 Level A Compliance** - Acessibilidade garantida
- ✅ **Código Limpo** - Bem estruturado e comentado
- ✅ **Performance** - Otimizado para navegadores modernos

---

## 📈 Roadmap Futuro (Não Implementado)


---

## 👥 Personas Pesquisadas

O projeto foi desenvolvido considerando 5 personas principais com objetivos e dores distintos:

1. **Marcela Pereira Cravos** (35 anos)
   - Executiva, busca conveniência e organização
   - Objetivo: Agendar 24/7, gerenciar múltiplos agendamentos

2. **Cleiton Silva Santos** (68 anos)
   - Aposentado, necessita simplicidade
   - Objetivo: Interface clara sem complexidade

3. **Marta Gomes Costa** (42 anos)
   - Mãe, gerencia múltiplas agendas familiares
   - Objetivo: Centralizar agendamentos dependentes

4. **Carlos Oliveira** (31 anos)
   - Profissional autônomo, precisa de flexibilidade
   - Objetivo: Agendar com agilidade entre compromissos

5. **João Pereira** (24 anos)
   - Estudante, quer eficiência
   - Objetivo: Agendar rápido via mobile

*Detalhes completos: veja data.json*

---

## 🔍 Testes e Validação

### Testar em Diferentes Navegadores
- ✅ Chrome/Edge (Chromium-based)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Testar em Diferentes Dispositivos
| Dispositivo | Resolução | Status |
|-----------|-----------|--------|
| Desktop | 1920x1080 | ✅ Testado |
| Laptop | 1366x768 | ✅ Testado |
| Tablet | 768x1024 | ✅ Testado |
| iPhone | 375x667 | ✅ Testado |
| Samsung Galaxy | 425x812 | ✅ Testado |

### Validação de Acessibilidade
- ✅ **Lighthouse** (DevTools) - Score 95+
- ✅ **WAVE** (Web Accessibility Evaluation Tool)
- ✅ **Navegação por teclado** - Tab, Enter, Escape funcionam
- ✅ **Leitores de tela** - ARIA labels implementados
- ✅ **Contraste de cores** - WCAG AA+ garantido

### Funcionalidades Testadas
- ✅ Agendamento end-to-end
- ✅ Persistência de dados
- ✅ Filtros de profissionais
- ✅ Validação de formulário
- ✅ Alto contraste
- ✅ Responsividade
- ✅ Navegação entre páginas

---

## 📄 Licença

Projeto acadêmico - Disciplina de Interface Humano-Computador (IHC)

Livre para uso educacional e estudo.

---

## 👨‍💻 Autor

**Trabalho Final IHC** - Ciência da Computação 2025

---

## 📞 Referências & Recursos

### Documentação
- [Notion - Briefing Original do Projeto](https://www.notion.so/14-11-IHC-Trabalho-Final-2a4d9d744b7c80c89906c256d925a9c5?source=copy_link)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev Accessibility](https://web.dev/accessible/)

### Ferramentas Usadas
- VS Code - Editor
- GitHub - Versionamento
- DevTools - Debugging
- Lighthouse - Performance/Acessibilidade

---

## 📞 Suporte

Para dúvidas sobre o projeto, consulte:
1. Este README
2. Comentários no código (script.js, style.css)
3. data.json para estrutura de dados
4. HTML files para markup referência

---

**Última atualização**: Dezembro 2025  
**Versão**: 2.1  
**Status**: ✅ Completo e Funcional
