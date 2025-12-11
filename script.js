// ============================================
// AGENDA SAÚDE - Script Principal v3.0
// ============================================
// Sistema de agendamento de consultas médicas
// Otimizado para performance e manutenibilidade

// ===== CONSTANTES E CONFIGURAÇÃO =====
const CONFIG = {
  STORAGE_KEY: "agendamentos_saude",
  DATA_FILE: "data.json",
  MODOS_COR_KEY: "modo_cor",
  MODO_MIOPIA_KEY: "modo_miopia",
  PROFISSIONAL_KEY: "profissional_selecionado",
  ANIMACAO_DELAY: 300,
  DEBOUNCE_DELAY: 300,
  CARROSSEL_AUTOPLAY: 5000
};

const MODOS_COR = {
  NORMAL: "",
  CONTRASTE: "alto-contraste",
  PROTANOPIA: "modo-protanopia",
  DEUTERANOPIA: "modo-deuteranopia",
  TRITANOPIA: "modo-tritanopia"
};

// ===== ESTADO GLOBAL =====
let agendamentos = [];
let profissionaisBase = [];
let personasData = [];

// ===== SELETORES DOM =====
const corpo = document.body;
const btnContraste = document.getElementById("toggle-contrast");

// Elementos da página de profissionais
const filtroEspecialidade = document.getElementById("filtro-especialidade");
const filtroNome = document.getElementById("filtro-nome");
const btnLimparFiltros = document.getElementById("btn-limpar-filtros");
const listaProfissionaisEl = document.getElementById("lista-profissionais");
const carrosselProfissionaisEl = document.getElementById("carrossel-profissionais");

// Elementos do formulário de agendamento
const formAgendamento = document.getElementById("form-agendamento");
const inputNomePaciente = document.getElementById("nome-paciente");
const inputProfissionalSelecionado = document.getElementById("profissional-selecionado");
const inputDataAgendamento = document.getElementById("data-agendamento");
const inputHoraAgendamento = document.getElementById("hora-agendamento");
const mensagemFeedback = document.getElementById("mensagem-feedback");

// Elementos da lista de agendamentos
const listaAgendamentosEl = document.getElementById("lista-agendamentos");
const btnLimparAgendamentos = document.getElementById("btn-limpar-agendamentos");

// Card do próximo agendamento (landing page)
const heroCardBody = document.querySelector(".hero-card-body");

// Container de personas
const personasContainer = document.getElementById("personas-grid");

// ============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS
// ============================================

/**
 * Carrega dados de data.json via fetch
 */
async function carregarDados() {
  try {
    const response = await fetch(CONFIG.DATA_FILE);
    if (!response.ok) throw new Error("Erro ao carregar data.json");
    
    const dados = await response.json();
    
    // Usar profissionais do data.json - 4 principais
    if (dados.profissionais && Array.isArray(dados.profissionais)) {
      profissionaisBase = dados.profissionais.slice(0, 6).map(prof => ({
        id: prof.id,
        nome: prof.nome,
        especialidade: prof.especialidade,
        especialidadeLabel: prof.especialidade, // Usar especialidade diretamente
        experiencia: prof.experiencia || `${prof.numeroAvaliacoes || 0} avaliações`,
        local: prof.convenioPrincipal || "Convênio disponível"
      }));
    }
    
    // Usar personas do data.json
    if (dados.personas && Array.isArray(dados.personas)) {
      personasData = dados.personas;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================
// FUNÇÕES DE RENDERIZAÇÃO
// ============================================

/**
 * Atualiza relógio e data na topbar
 */
function atualizarRelogioTopbar() {
  const dateEl = document.getElementById('topbar-date');
  const timeEl = document.getElementById('topbar-time');
  
  if (!dateEl || !timeEl) return;
  
  function atualizar() {
    const agora = new Date();
    
    // Formatar data: DD/MM/YYYY
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    dateEl.textContent = `${dia}/${mes}/${ano}`;
    
    // Formatar hora: HH:MM:SS
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    timeEl.textContent = `${horas}:${minutos}:${segundos}`;
  }
  
  atualizar();
  setInterval(atualizar, 1000);
}

/**
 * Renderiza carrossel de profissionais
 */
function renderizarCarrossel(lista) {
  const carrosselTrack = document.getElementById("carrossel-profissionais");
  if (!carrosselTrack) return;
  
  carrosselTrack.innerHTML = "";
  
  if (!lista.length) return;
  
  lista.forEach((prof) => {
    const card = document.createElement("article");
    card.className = "card-profissional";

    const nomeEl = document.createElement("p");
    nomeEl.className = "card-profissional-nome";
    nomeEl.textContent = prof.nome;

    const espEl = document.createElement("p");
    espEl.className = "card-profissional-especialidade";
    espEl.textContent = prof.especialidadeLabel;

    const infoEl = document.createElement("p");
    infoEl.className = "card-profissional-info";
    infoEl.textContent = `${prof.experiencia} • ${prof.local}`;

    const footer = document.createElement("div");
    footer.className = "card-profissional-footer";

    const btnAgendar = document.createElement("button");
    btnAgendar.textContent = "Agendar";
    btnAgendar.className = "btn btn-primary";

    btnAgendar.addEventListener("click", () => {
      selecionarProfissional(prof);
    });

    footer.appendChild(btnAgendar);
    card.appendChild(nomeEl);
    card.appendChild(espEl);
    card.appendChild(infoEl);
    card.appendChild(footer);

    carrosselTrack.appendChild(card);
  });
  
  inicializarCarrossel();
}

/**
 * Renderiza personas na página "Sobre"
 */
function renderizarPersonas() {
  if (!personasContainer || !personasData.length) return;
  
  personasContainer.innerHTML = "";

  personasData.forEach((persona) => {
    const card = document.createElement("article");
    card.className = "card-persona";

    const nome = document.createElement("h3");
    nome.textContent = persona.nome;

    const perfil = document.createElement("p");
    perfil.className = "persona-perfil";
    perfil.textContent = `${persona.profissao}, ${persona.idade} anos`;

    const tipo = document.createElement("p");
    tipo.className = "persona-tipo";
    tipo.textContent = persona.tipo;

    const objetivos = document.createElement("div");
    objetivos.className = "persona-section";
    objetivos.innerHTML = "<strong>Objetivos:</strong>";
    const objList = document.createElement("ul");
    persona.objetivos.forEach(obj => {
      const li = document.createElement("li");
      li.textContent = obj;
      objList.appendChild(li);
    });
    objetivos.appendChild(objList);

    card.appendChild(nome);
    card.appendChild(perfil);
    card.appendChild(tipo);
    card.appendChild(objetivos);

    personasContainer.appendChild(card);
  });
}

// ============================================
// FUNÇÕES DE AGENDAMENTO
// ============================================

/**
 * Seleciona um profissional e prepara para agendamento
 */
function selecionarProfissional(prof) {
  if (!prof || !prof.nome) {
    console.error('Profissional inválido:', prof);
    return;
  }
  
  // Sempre salvar no localStorage
  localStorage.setItem(CONFIG.PROFISSIONAL_KEY, JSON.stringify(prof));
  
  // Se estamos na página de agendamentos, preencher o campo
  if (inputProfissionalSelecionado) {
    inputProfissionalSelecionado.value = `${prof.nome} (${prof.especialidadeLabel})`;
    if (mensagemFeedback) {
      mensagemFeedback.textContent = `Profissional selecionado: ${prof.nome}.`;
      mensagemFeedback.style.color = "var(--cor-primaria-escura)";
    }
    if (inputNomePaciente) {
      setTimeout(() => inputNomePaciente.focus(), CONFIG.ANIMACAO_DELAY);
    }
  } else {
    // Se não estamos na página de agendamentos, navegar para lá
    window.location.href = "agendamentos.html";
  }
}

/**
 * Cria objeto de agendamento com dados do formulário
 */
function criarAgendamentoObj() {
  return {
    nomePaciente: inputNomePaciente.value.trim(),
    profissional: inputProfissionalSelecionado.value.trim(),
    data: inputDataAgendamento.value,
    horario: inputHoraAgendamento.value, // Mudado de 'hora' para 'horario'
    paciente: inputNomePaciente.value.trim() // Adicionar campo paciente para timeline
  };
}

/**
 * Valida agendamento antes de salvar
 */
function validarAgendamento(a) {
  if (!a.nomePaciente) return "Informe o nome do paciente.";
  if (!a.profissional) return "Selecione um profissional.";
  if (!a.data) return "Informe a data.";
  if (!a.horario) return "Informe o horário."; // Mudado de 'hora' para 'horario'
  return null;
}

/**
 * Salva agendamento na memória e localStorage
 */
function salvarAgendamento(a) {
  agendamentos.push(a);
  salvarNoStorage();
  atualizarListaAgendamentos();
  atualizarProximoAgendamento();
}

// ============================================
// FUNÇÕES DE PERSISTÊNCIA
// ============================================

/**
 * Salva agendamentos no localStorage
 */
function salvarNoStorage() {
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(agendamentos));
  // Atualizar timeline após salvar
  renderizarLinhaDoTempo();
}

/**
 * Carrega agendamentos do localStorage
 */
function carregarDoStorage() {
  const dados = localStorage.getItem(CONFIG.STORAGE_KEY);

  if (dados) {
    try {
      agendamentos = JSON.parse(dados) || [];
    } catch {
      agendamentos = [];
    }
  } else {
    agendamentos = [];
  }

  if (listaAgendamentosEl) atualizarListaAgendamentos();
  if (heroCardBody) atualizarProximoAgendamento();
  
  // Renderizar linha do tempo
  renderizarLinhaDoTempo();
}

// ============================================
// FUNÇÕES DE UTILITÁRIOS
// ============================================

/**
 * Formata data ISO (YYYY-MM-DD) para padrão brasileiro (DD/MM/YYYY)
 */
function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Atualiza lista visual de agendamentos
 */
function atualizarListaAgendamentos() {
  if (!listaAgendamentosEl) return;
  
  const listaEmpty = document.getElementById("lista-empty");
  
  listaAgendamentosEl.innerHTML = "";

  if (!agendamentos.length) {
    // Mostrar estado vazio
    if (listaEmpty) {
      listaEmpty.classList.add("show");
      listaAgendamentosEl.style.display = "none";
    } else {
      const li = document.createElement("li");
      li.className = "item-agendamento";
      li.textContent = "Nenhum agendamento ainda.";
      listaAgendamentosEl.appendChild(li);
    }
    return;
  }

  // Ocultar estado vazio e mostrar lista
  if (listaEmpty) {
    listaEmpty.classList.remove("show");
    listaAgendamentosEl.style.display = "flex";
  }

  const ordenados = [...agendamentos].sort((a, b) => {
    return new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`);
  });

  ordenados.forEach((ag) => {
    const li = document.createElement("li");
    li.className = "item-agendamento";

    const titulo = document.createElement("strong");
    titulo.textContent = `${formatarData(ag.data)} às ${ag.hora}`;

    const prof = document.createElement("span");
    prof.textContent = `Profissional: ${ag.profissional}`;

    const pac = document.createElement("span");
    pac.textContent = `Paciente: ${ag.nomePaciente}`;

    li.appendChild(titulo);
    li.appendChild(prof);
    li.appendChild(pac);

    listaAgendamentosEl.appendChild(li);
  });
}

/**
 * Atualiza card do próximo agendamento na landing page
 */
function atualizarProximoAgendamento() {
  if (!heroCardBody) return;

  if (!agendamentos.length) {
    heroCardBody.textContent = "Nenhum agendamento selecionado.";
    return;
  }

  const ordenados = [...agendamentos].sort((a, b) => {
    return new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`);
  });

  const prox = ordenados[0];
  heroCardBody.textContent = `${formatarData(prox.data)} às ${prox.hora} — ${prox.profissional}`;
}

// ============================================
// FUNÇÕES DE FILTROS
// ============================================

/**
 * Função debounce para otimizar performance
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Renderiza resultados da pesquisa no dropdown
 */
function renderizarResultadosPesquisa(resultados) {
  const dropdown = document.getElementById("resultados-pesquisa");
  if (!dropdown) return;

  if (resultados.length === 0) {
    dropdown.classList.add("hidden");
    return;
  }

  dropdown.innerHTML = resultados.map(prof => `
    <div class="resultado-item" data-id="${prof.id}">
      <div class="resultado-nome">${prof.nome}</div>
      <div class="resultado-especialidade">${prof.especialidade}</div>
      <div class="resultado-info">${prof.crm} | ${prof.estado}</div>
    </div>
  `).join("");

  dropdown.classList.remove("hidden");

  // Adicionar event listeners aos itens
  dropdown.querySelectorAll(".resultado-item").forEach(item => {
    item.addEventListener("click", () => {
      const profId = item.dataset.id;
      const profissional = profissionaisBase.find(p => p.id == profId);
      if (profissional && filtroNome) {
        filtroNome.value = profissional.nome;
        dropdown.classList.add("hidden");
        aplicarFiltros();
      }
    });
  });
}

/**
 * Pesquisa profissionais em tempo real
 */
function pesquisarProfissionais(termo) {
  if (!termo || termo.length < 2) {
    const dropdown = document.getElementById("resultados-pesquisa");
    if (dropdown) dropdown.classList.add("hidden");
    return;
  }

  const termoLower = termo.toLowerCase();
  const resultados = profissionaisBase.filter(prof =>
    prof.nome.toLowerCase().includes(termoLower)
  ).slice(0, 8); // Limitar a 8 resultados

  renderizarResultadosPesquisa(resultados);
}

/**
 * Aplica filtros de especialidade e nome
 */
function aplicarFiltros() {
  if (!filtroEspecialidade || !filtroNome) return;
  
  const esp = filtroEspecialidade.value;
  const nome = filtroNome.value.trim().toLowerCase();

  let filtrados = profissionaisBase;

  if (esp !== "todas") {
    filtrados = filtrados.filter((p) => p.especialidade === esp);
  }

  if (nome) {
    filtrados = filtrados.filter((p) =>
      p.nome.toLowerCase().includes(nome)
    );
  }

  renderizarCarrossel(filtrados);
  
  // Esconder dropdown após aplicar filtro
  const dropdown = document.getElementById("resultados-pesquisa");
  if (dropdown) dropdown.classList.add("hidden");
}

/**
 * Limpa todos os filtros e recarrega lista completa
 */
function limparFiltros() {
  if (!filtroEspecialidade || !filtroNome) return;
  
  filtroEspecialidade.value = "todas";
  filtroNome.value = "";
  
  // Esconder dropdown
  const dropdown = document.getElementById("resultados-pesquisa");
  if (dropdown) dropdown.classList.add("hidden");
  
  aplicarFiltros();
}

// ============================================
// EVENT LISTENERS
// ============================================

// Formulário de agendamento
if (formAgendamento) {
  // Atualizar preview em tempo real
  const atualizarPreview = () => {
    const previewCard = document.getElementById("preview-card");
    const previewInfo = document.getElementById("preview-info");
    const previewData = document.getElementById("preview-data");
    const previewHora = document.getElementById("preview-hora");
    const previewPaciente = document.getElementById("preview-paciente");
    const previewProfissional = document.getElementById("preview-profissional");
    
    if (!previewCard || !previewInfo) return;
    
    const nome = inputNomePaciente?.value || "";
    const prof = inputProfissionalSelecionado?.value || "";
    const data = inputDataAgendamento?.value || "";
    const hora = inputHoraAgendamento?.value || "";
    
    if (nome || prof || data || hora) {
      previewCard.style.display = "none";
      previewInfo.style.display = "block";
      
      if (previewData) previewData.textContent = data ? formatarData(data) : "-";
      if (previewHora) previewHora.textContent = hora || "-";
      if (previewPaciente) previewPaciente.textContent = nome || "-";
      if (previewProfissional) previewProfissional.textContent = prof || "-";
    } else {
      previewCard.style.display = "flex";
      previewInfo.style.display = "none";
    }
  };
  
  // Listeners para atualizar preview
  if (inputNomePaciente) inputNomePaciente.addEventListener("input", atualizarPreview);
  if (inputProfissionalSelecionado) inputProfissionalSelecionado.addEventListener("change", atualizarPreview);
  if (inputDataAgendamento) inputDataAgendamento.addEventListener("change", atualizarPreview);
  if (inputHoraAgendamento) inputHoraAgendamento.addEventListener("change", atualizarPreview);
  
  formAgendamento.addEventListener("submit", (e) => {
    e.preventDefault();

    const ag = criarAgendamentoObj();
    const erro = validarAgendamento(ag);

    if (erro) {
      mensagemFeedback.textContent = erro;
      mensagemFeedback.style.color = "red";
      return;
    }

    salvarAgendamento(ag);
    mensagemFeedback.textContent = "✅ Agendamento confirmado!";
    mensagemFeedback.style.color = "green";

    formAgendamento.reset();
    inputProfissionalSelecionado.value = "";
    localStorage.removeItem("profissional_selecionado");
    
    // Resetar preview
    atualizarPreview();
  });
}

// Botões e filtros
if (btnLimparFiltros) btnLimparFiltros.addEventListener("click", limparFiltros);
if (filtroEspecialidade) filtroEspecialidade.addEventListener("change", aplicarFiltros);
// Pesquisa em tempo real com dropdown
if (filtroNome) {
  filtroNome.addEventListener("input", debounce((e) => {
    const termo = e.target.value.trim();
    if (termo.length >= 2) {
      pesquisarProfissionais(termo);
    } else {
      aplicarFiltros();
    }
  }, 300));

  // Esconder dropdown ao perder foco (com delay para permitir clique no item)
  filtroNome.addEventListener("blur", () => {
    setTimeout(() => {
      const dropdown = document.getElementById("resultados-pesquisa");
      if (dropdown) dropdown.classList.add("hidden");
    }, 200);
  });

  // Mostrar dropdown novamente ao focar (se houver texto)
  filtroNome.addEventListener("focus", (e) => {
    const termo = e.target.value.trim();
    if (termo.length >= 2) {
      pesquisarProfissionais(termo);
    }
  });
}

// Limpar agendamentos
if (btnLimparAgendamentos) {
  btnLimparAgendamentos.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja limpar todos os agendamentos?")) {
      agendamentos = [];
      salvarNoStorage();
      atualizarListaAgendamentos();
      atualizarProximoAgendamento();
    }
  });
}

// Alto contraste - toggle simples
if (btnContraste) {
  btnContraste.addEventListener("click", () => {
    corpo.classList.toggle("alto-contraste");
    localStorage.setItem("modo_contraste", corpo.classList.contains("alto-contraste"));
    btnContraste.textContent = corpo.classList.contains("alto-contraste") ? "🌙 Alto Contraste" : "🎨 Cores Normais";
  });
}

// Modo miopia
const btnMiopia = document.getElementById("toggle-miopia");
if (btnMiopia) {
  btnMiopia.addEventListener("click", () => {
    corpo.classList.toggle("modo-miopia");
    localStorage.setItem("modo_miopia", corpo.classList.contains("modo-miopia"));
  });
}

// Popup de Acessibilidade - abre/fecha e sincroniza opções
const btnAcess = document.getElementById("toggle-accessibility");
const popup = document.getElementById("accessibility-popup");
const popupClose = document.getElementById("popup-close");
const modoCorSelect = document.getElementById("modo-cor-select");
const miopiaCheckbox = document.getElementById("toggle-miopia-checkbox");

if (btnAcess && popup) {
  // abrir/fechar popup
  btnAcess.addEventListener("click", () => {
    const isHidden = popup.classList.toggle("hidden");
    popup.setAttribute("aria-hidden", popup.classList.contains("hidden") ? "true" : "false");
    if (!popup.classList.contains("hidden")) {
      const first = popup.querySelector(".popup-content");
      if (first) first.focus();
    }
  });

  // fechar botão
  if (popupClose) {
    popupClose.addEventListener("click", () => {
      popup.classList.add("hidden");
      popup.setAttribute("aria-hidden", "true");
      btnAcess.focus();
    });
  }

  // fechar ao clicar fora do conteúdo
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.add("hidden");
      popup.setAttribute("aria-hidden", "true");
      btnAcess.focus();
    }
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popup.classList.contains("hidden")) {
      popup.classList.add("hidden");
      popup.setAttribute("aria-hidden", "true");
      btnAcess.focus();
    }
  });

  // Modo de cor select handler
  if (modoCorSelect) {
    modoCorSelect.addEventListener("change", () => {
      const modo = modoCorSelect.value;
      
      // Remove todas as classes de modo de cor
      Object.values(MODOS_COR).forEach(classe => {
        if (classe) corpo.classList.remove(classe);
      });
      
      // Aplica o modo selecionado
      if (modo !== "normal") {
        let classeAplicar = modo;
        // Adiciona prefixo 'modo-' para daltonismo se necessário
        if (modo === "protanopia" || modo === "deuteranopia" || modo === "tritanopia") {
          classeAplicar = "modo-" + modo;
        }
        corpo.classList.add(classeAplicar);
      }
      
      localStorage.setItem(CONFIG.MODOS_COR_KEY, modo);
    });
  }

  // Toggle switch handler para miopia
  const miopiaSwitch = document.getElementById("toggle-miopia-switch");
  if (miopiaSwitch) {
    miopiaSwitch.addEventListener("change", () => {
      corpo.classList.toggle("modo-miopia", miopiaSwitch.checked);
      localStorage.setItem(CONFIG.MODO_MIOPIA_KEY, miopiaSwitch.checked);
    });
  }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa a aplicação
 */
async function inicializar() {
  // Carregar dados de data.json
  await carregarDados();
  
  // Aplicar modo de cor salvo
  const modoCor = localStorage.getItem(CONFIG.MODOS_COR_KEY) || "normal";
  if (modoCor !== "normal") {
    let classeAplicar = modoCor;
    // Adiciona prefixo 'modo-' para daltonismo se necessário
    if (modoCor === "protanopia" || modoCor === "deuteranopia" || modoCor === "tritanopia") {
      classeAplicar = "modo-" + modoCor;
    }
    corpo.classList.add(classeAplicar);
  }
  
  // Sincronizar select do popup (se existir)
  const modoCorSelectEl = document.getElementById("modo-cor-select");
  if (modoCorSelectEl) {
    modoCorSelectEl.value = modoCor;
  }

  // Aplicar modo miopia salvo
  const modoMiopia = localStorage.getItem(CONFIG.MODO_MIOPIA_KEY) === "true";
  if (modoMiopia) {
    corpo.classList.add("modo-miopia");
  }
  
  // Sincronizar toggle switch de miopia
  const miopiaSwitchEl = document.getElementById("toggle-miopia-switch");
  if (miopiaSwitchEl) {
    miopiaSwitchEl.checked = modoMiopia;
  }
  
  // Marcar página ativa no menu
  marcarPaginaAtiva();
  
  // Renderizar profissionais se existir container (carrossel)
  if (carrosselProfissionaisEl || listaProfissionaisEl) {
    renderizarCarrossel(profissionaisBase);
  }
  
  // Carregar agendamentos salvos
  carregarDoStorage();
  
  // Carregar profissional pré-selecionado
  const profSelecionado = localStorage.getItem(CONFIG.PROFISSIONAL_KEY);
  if (profSelecionado && inputProfissionalSelecionado) {
    try {
      const prof = JSON.parse(profSelecionado);
      inputProfissionalSelecionado.value = `${prof.nome} (${prof.especialidadeLabel})`;
    } catch (e) {
      // Silenciosamente ignora se houver erro
      console.warn('Erro ao carregar profissional selecionado:', e);
    }
  }
  
  // Renderizar personas se existir container
  if (personasContainer) {
    renderizarPersonas();
  }
  
  // Inicializar relógio na topbar
  atualizarRelogioTopbar();
  
  // Criar indicadores de navegação lateral
  criarIndicadoresLaterais();
  
  // Inicializar navegação de agendamentos
  inicializarNavegacaoAgendamentos();
}

/**
 * Marca a página ativa no menu de navegação
 */
function marcarPaginaAtiva() {
  const nomeArquivo = window.location.pathname.split("/").pop() || "index.html";
  const linksNav = document.querySelectorAll(".nav-list a");
  
  linksNav.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("ativo");
    
    if (href === nomeArquivo || (nomeArquivo === "" && href === "index.html")) {
      link.classList.add("ativo");
    }
  });
}

// ============================================
// NAVEGAÇÃO LATERAL POR CLIQUE
// ============================================

/**
 * Sistema de navegação sequencial por clique nas laterais da tela
 */
const PAGINAS_SEQUENCIA = [
  "index.html",
  "profissionais.html",
  "agendamentos.html",
  "sobre.html"
];

function obterPaginaAtual() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path === "" ? "index.html" : path;
}

function navegarParaPagina(direcao) {
  const paginaAtual = obterPaginaAtual();
  const indiceAtual = PAGINAS_SEQUENCIA.indexOf(paginaAtual);
  
  if (indiceAtual === -1) return; // Página não está na sequência
  
  let novoIndice;
  if (direcao === "proximo") {
    novoIndice = (indiceAtual + 1) % PAGINAS_SEQUENCIA.length;
  } else {
    novoIndice = (indiceAtual - 1 + PAGINAS_SEQUENCIA.length) % PAGINAS_SEQUENCIA.length;
  }
  
  window.location.href = PAGINAS_SEQUENCIA[novoIndice];
}

// Detectar clique nas laterais da tela
document.addEventListener("click", (e) => {
  const larguraTela = window.innerWidth;
  const zonaClique = 80; // pixels das laterais que ativam navegação
  
  // Ignorar cliques em elementos interativos
  const elementoClicado = e.target;
  if (elementoClicado.closest("a, button, input, select, textarea, .popup-content")) {
    return;
  }
  
  if (e.clientX < zonaClique) {
    // Clique na lateral esquerda - volta
    navegarParaPagina("anterior");
  } else if (e.clientX > larguraTela - zonaClique) {
    // Clique na lateral direita - avança
    navegarParaPagina("proximo");
  }
});

// Navegação por setas do teclado (horizontal e vertical)
let indiceElementoFocado = -1;
let elementosFocaveis = [];

function atualizarElementosFocaveis() {
  elementosFocaveis = Array.from(document.querySelectorAll(
    'a, button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
  });
}

document.addEventListener("keydown", (e) => {
  // Ignorar se estiver digitando em input/textarea
  const elementoAtivo = document.activeElement;
  const estaDigitando = elementoAtivo.matches("input, textarea, select");
  
  // Navegação horizontal (páginas)
  if (e.key === "ArrowLeft" && !estaDigitando) {
    navegarParaPagina("anterior");
  } else if (e.key === "ArrowRight" && !estaDigitando) {
    navegarParaPagina("proximo");
  }
  
  // Navegação vertical (elementos focáveis)
  else if (e.key === "ArrowDown" && !estaDigitando) {
    e.preventDefault();
    atualizarElementosFocaveis();
    indiceElementoFocado = (indiceElementoFocado + 1) % elementosFocaveis.length;
    if (elementosFocaveis[indiceElementoFocado]) {
      elementosFocaveis[indiceElementoFocado].focus();
      elementosFocaveis[indiceElementoFocado].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else if (e.key === "ArrowUp" && !estaDigitando) {
    e.preventDefault();
    atualizarElementosFocaveis();
    indiceElementoFocado = (indiceElementoFocado - 1 + elementosFocaveis.length) % elementosFocaveis.length;
    if (elementosFocaveis[indiceElementoFocado]) {
      elementosFocaveis[indiceElementoFocado].focus();
      elementosFocaveis[indiceElementoFocado].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

// Adicionar indicadores visuais de navegação lateral
function criarIndicadoresLaterais() {
  // Ordem das páginas para navegação
  const paginas = [
    "index.html",
    "profissionais.html",
    "agendamentos.html",
    "sobre.html"
  ];
  
  // Detectar página atual
  const nomeArquivo = window.location.pathname.split("/").pop() || "index.html";
  const indiceAtual = paginas.indexOf(nomeArquivo);
  
  // Página anterior
  const paginaAnterior = indiceAtual > 0 ? paginas[indiceAtual - 1] : null;
  // Próxima página
  const proximaPagina = indiceAtual < paginas.length - 1 ? paginas[indiceAtual + 1] : null;
  
  // Criar indicador esquerdo (página anterior)
  if (paginaAnterior) {
    const indicadorEsquerdo = document.createElement("a");
    indicadorEsquerdo.className = "indicador-navegacao indicador-esquerdo";
    indicadorEsquerdo.innerHTML = "←";
    indicadorEsquerdo.href = paginaAnterior;
    indicadorEsquerdo.title = "Ir para página anterior";
    indicadorEsquerdo.setAttribute("aria-label", "Página anterior");
    document.body.appendChild(indicadorEsquerdo);
  }
  
  // Criar indicador direito (próxima página)
  if (proximaPagina) {
    const indicadorDireito = document.createElement("a");
    indicadorDireito.className = "indicador-navegacao indicador-direito";
    indicadorDireito.innerHTML = "→";
    indicadorDireito.href = proximaPagina;
    indicadorDireito.title = "Ir para próxima página";
    indicadorDireito.setAttribute("aria-label", "Próxima página");
    document.body.appendChild(indicadorDireito);
  }
}

// ============================================
// CARROSSEL 3D
// ============================================

let indiceCarrosselAtual = 0;
let carrosselIntervalo = null;

function inicializarCarrossel() {
  const track = document.getElementById("carrossel-profissionais");
  const btnPrev = document.getElementById("carrossel-prev");
  const btnNext = document.getElementById("carrossel-next");
  
  if (!track || !btnPrev || !btnNext) return;
  
  const cards = track.querySelectorAll(".card-profissional");
  const cardWidth = 344; // 320px + 24px gap
  
  function atualizarCarrossel() {
    const offset = -indiceCarrosselAtual * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
  }
  
  btnNext.addEventListener("click", () => {
    if (indiceCarrosselAtual < cards.length - 1) {
      indiceCarrosselAtual++;
      atualizarCarrossel();
    }
  });
  
  btnPrev.addEventListener("click", () => {
    if (indiceCarrosselAtual > 0) {
      indiceCarrosselAtual--;
      atualizarCarrossel();
    }
  });
  
  // Autoplay (opcional)
  carrosselIntervalo = setInterval(() => {
    if (indiceCarrosselAtual < cards.length - 1) {
      indiceCarrosselAtual++;
    } else {
      indiceCarrosselAtual = 0;
    }
    atualizarCarrossel();
  }, 5000);
  
  // Pausar autoplay no hover
  track.addEventListener("mouseenter", () => {
    if (carrosselIntervalo) clearInterval(carrosselIntervalo);
  });
  
  track.addEventListener("mouseleave", () => {
    carrosselIntervalo = setInterval(() => {
      if (indiceCarrosselAtual < cards.length - 1) {
        indiceCarrosselAtual++;
      } else {
        indiceCarrosselAtual = 0;
      }
      atualizarCarrossel();
    }, 5000);
  });
}

// ============================================
// LINHA DO TEMPO
// ============================================

function renderizarLinhaDoTempo() {
  const timelineContainer = document.getElementById("timeline-appointments");
  if (!timelineContainer) return;
  
  timelineContainer.innerHTML = "";
  
  const agendamentos = obterDoStorage();
  
  if (!agendamentos.length) {
    timelineContainer.innerHTML = `
      <div class="timeline-empty">
        <div class="timeline-empty-icon">📅</div>
        <p>Nenhuma consulta agendada ainda</p>
      </div>
    `;
    return;
  }
  
  agendamentos.forEach((agendamento) => {
    const data = new Date(agendamento.data + "T00:00:00");
    const mes = data.getMonth() + 1; // 1-12
    const posicao = ((mes - 1) / 11) * 100; // Porcentagem na linha (0-100%)
    
    const marcador = document.createElement("div");
    marcador.className = "timeline-appointment";
    marcador.style.left = `${posicao}%`;
    
    const dataFormatada = data.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "short" 
    });
    
    marcador.innerHTML = `
      <span class="timeline-appointment-date">${dataFormatada}</span>
      <span class="timeline-appointment-time">${agendamento.horario}</span>
      <span class="timeline-appointment-info">${agendamento.profissional}</span>
    `;
    
    marcador.title = `${agendamento.paciente} - ${agendamento.profissional}`;
    
    timelineContainer.appendChild(marcador);
  });
}

// ============================================
// NAVEGAÇÃO AGENDAMENTOS
// ============================================

/**
 * Sistema de navegação entre formulário e lista de agendamentos
 */
function inicializarNavegacaoAgendamentos() {
  const tabNovo = document.getElementById("tab-novo");
  const tabLista = document.getElementById("tab-lista");
  const contentNovo = document.getElementById("content-novo");
  const contentLista = document.getElementById("content-lista");
  
  if (!tabNovo || !tabLista || !contentNovo || !contentLista) return;
  
  // Handler para trocar de aba
  tabNovo.addEventListener("click", () => {
    tabNovo.classList.add("active");
    tabLista.classList.remove("active");
    contentNovo.classList.add("active");
    contentLista.classList.remove("active");
  });
  
  tabLista.addEventListener("click", () => {
    tabLista.classList.add("active");
    tabNovo.classList.remove("active");
    contentLista.classList.add("active");
    contentNovo.classList.remove("active");
  });
}

// ============================================
// RELÓGIO E CALENDÁRIO
// ============================================

// ============================================
// CARROSSEL COM SCROLL E TECLADO
// ============================================

function inicializarCarrosselScroll() {
  const carrosselWrapper = document.querySelector(".carrossel-wrapper");
  if (!carrosselWrapper) return;
  
  // Navegação por teclado (setas esquerda/direita) quando focado no carrossel
  carrosselWrapper.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      carrosselWrapper.scrollBy({ left: -350, behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      carrosselWrapper.scrollBy({ left: 350, behavior: "smooth" });
    }
  });
  
  // Tornar focável para capturar eventos de teclado
  carrosselWrapper.setAttribute("tabindex", "0");
  
  // Adicionar indicador visual de que pode usar scroll
  carrosselWrapper.style.cursor = "grab";
  
  let isDown = false;
  let startX;
  let scrollLeft;
  
  carrosselWrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    carrosselWrapper.style.cursor = "grabbing";
    startX = e.pageX - carrosselWrapper.offsetLeft;
    scrollLeft = carrosselWrapper.scrollLeft;
  });
  
  carrosselWrapper.addEventListener("mouseleave", () => {
    isDown = false;
    carrosselWrapper.style.cursor = "grab";
  });
  
  carrosselWrapper.addEventListener("mouseup", () => {
    isDown = false;
    carrosselWrapper.style.cursor = "grab";
  });
  
  carrosselWrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carrosselWrapper.offsetLeft;
    const walk = (x - startX) * 2;
    carrosselWrapper.scrollLeft = scrollLeft - walk;
  });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

// Executar inicialização quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    inicializar();
    inicializarCarrosselScroll();
  });
} else {
  inicializar();
  inicializarCarrosselScroll();
}
