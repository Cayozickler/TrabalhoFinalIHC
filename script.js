const profissionaisBase = [
  {
    id: 1,
    nome: "Dra. Ana Souza",
    especialidade: "cardiologia",
    especialidadeLabel: "Cardiologia",
    experiencia: "10 anos de experiência",
    local: "Clínica Coração Saudável - Centro",
  },
  {
    id: 2,
    nome: "Dr. João Lima",
    especialidade: "pediatria",
    especialidadeLabel: "Pediatria",
    experiencia: "8 anos de experiência",
    local: "Hospital Infantil Esperança",
  },
  {
    id: 3,
    nome: "Dra. Marina Alves",
    especialidade: "dermatologia",
    especialidadeLabel: "Dermatologia",
    experiencia: "6 anos de experiência",
    local: "Clínica Pele & Saúde",
  },
  {
    id: 4,
    nome: "Dr. Carlos Nogueira",
    especialidade: "clinico",
    especialidadeLabel: "Clínico Geral",
    experiencia: "12 anos de experiência",
    local: "Unidade Básica de Saúde - Bairro Norte",
  },
];

const STORAGE_KEY = "agendamentos_saude";

let agendamentos = [];

const corpo = document.body;
const btnContraste = document.getElementById("toggle-contrast");

const filtroEspecialidade = document.getElementById("filtro-especialidade");
const filtroNome = document.getElementById("filtro-nome");
const btnLimparFiltros = document.getElementById("btn-limpar-filtros");
const listaProfissionaisEl = document.getElementById("lista-profissionais");

const formAgendamento = document.getElementById("form-agendamento");
const inputNomePaciente = document.getElementById("nome-paciente");
const inputProfissionalSelecionado = document.getElementById("profissional-selecionado");
const inputDataAgendamento = document.getElementById("data-agendamento");
const inputHoraAgendamento = document.getElementById("hora-agendamento");
const inputObservacoes = document.getElementById("observacoes");
const mensagemFeedback = document.getElementById("mensagem-feedback");

const listaAgendamentosEl = document.getElementById("lista-agendamentos");
const btnLimparAgendamentos = document.getElementById("btn-limpar-agendamentos");

const heroCardBody = document.querySelector(".hero-card-body");

function renderizarProfissionais(lista) {
  listaProfissionaisEl.innerHTML = "";

  if (!lista.length) {
    const msg = document.createElement("p");
    msg.textContent = "Nenhum profissional encontrado.";
    listaProfissionaisEl.appendChild(msg);
    return;
  }

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

    listaProfissionaisEl.appendChild(card);
  });
}

function selecionarProfissional(prof) {
  inputProfissionalSelecionado.value = `${prof.nome} (${prof.especialidadeLabel})`;
  mensagemFeedback.textContent = `Profissional selecionado: ${prof.nome}.`;
  mensagemFeedback.style.color = "var(--cor-primaria-escura)";
  formAgendamento.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => inputNomePaciente.focus(), 300);
}

function aplicarFiltros() {
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

  renderizarProfissionais(filtrados);
}

function limparFiltros() {
  filtroEspecialidade.value = "todas";
  filtroNome.value = "";
  aplicarFiltros();
}

function criarAgendamentoObj() {
  return {
    nomePaciente: inputNomePaciente.value.trim(),
    profissional: inputProfissionalSelecionado.value.trim(),
    data: inputDataAgendamento.value,
    hora: inputHoraAgendamento.value,
    observacoes: inputObservacoes.value.trim(),
  };
}

function validarAgendamento(a) {
  if (!a.nomePaciente) return "Informe o nome do paciente.";
  if (!a.profissional) return "Selecione um profissional.";
  if (!a.data) return "Informe a data.";
  if (!a.hora) return "Informe o horário.";
  return null;
}

function salvarNoStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
}

function carregarDoStorage() {
  const dados = localStorage.getItem(STORAGE_KEY);

  if (dados) {
    try {
      agendamentos = JSON.parse(dados) || [];
    } catch {
      agendamentos = [];
    }
  } else {
    agendamentos = [];
  }

  atualizarListaAgendamentos();
  atualizarProximoAgendamento();
}

function salvarAgendamento(a) {
  agendamentos.push(a);
  salvarNoStorage();
  atualizarListaAgendamentos();
  atualizarProximoAgendamento();
}

function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function atualizarListaAgendamentos() {
  listaAgendamentosEl.innerHTML = "";

  if (!agendamentos.length) {
    const li = document.createElement("li");
    li.className = "item-agendamento";
    li.textContent = "Nenhum agendamento ainda.";
    listaAgendamentosEl.appendChild(li);
    return;
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

    if (ag.observacoes) {
      const obs = document.createElement("span");
      obs.textContent = `Observações: ${ag.observacoes}`;
      li.appendChild(obs);
    }

    listaAgendamentosEl.appendChild(li);
  });
}

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
  mensagemFeedback.textContent = "Agendamento confirmado!";
  mensagemFeedback.style.color = "green";

  formAgendamento.reset();
  inputProfissionalSelecionado.value = "";
});

btnLimparFiltros.addEventListener("click", limparFiltros);
filtroEspecialidade.addEventListener("change", aplicarFiltros);
filtroNome.addEventListener("input", aplicarFiltros);

btnLimparAgendamentos.addEventListener("click", () => {
  agendamentos = [];
  salvarNoStorage();
  atualizarListaAgendamentos();
  atualizarProximoAgendamento();
});

btnContraste.addEventListener("click", () => {
  corpo.classList.toggle("alto-contraste");
});

renderizarProfissionais(profissionaisBase);
carregarDoStorage();
