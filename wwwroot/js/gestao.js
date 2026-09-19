// ===== Configuração =====
const JORNADA_SEGUNDOS = 8 * 60 * 60; // meta: 8 horas de trabalho

// ===== Elementos da tela =====
const elRelogioAtual = document.getElementById("relogioAtual");
const elHorasTrabalhadas = document.getElementById("horasTrabalhadas");
const elTempoRestante = document.getElementById("tempoRestante");
const elStatusBadge = document.getElementById("statusBadge");
const elBtnPonto = document.getElementById("btnPonto");
const elMotivoInput = document.getElementById("motivoInput");
const elListaRegistros = document.getElementById("listaRegistros");

// ===== Utilitários de data/hora =====

// Data de hoje no formato "YYYY-MM-DD", usada para separar os registros por dia
function dataDeHojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

// Chave usada no localStorage — uma lista de registros por dia
function chaveStorage() {
    return `pontoRegistros_${dataDeHojeISO()}`;
}

// Converte um total de segundos em texto "HH:MM:SS"
function formatarTempo(totalSegundos) {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = Math.floor(totalSegundos % 60);
    return [horas, minutos, segundos].map(n => String(n).padStart(2, "0")).join(":");
}

function formatarHora(data) {
    return data.toLocaleTimeString("pt-BR");
}

// ===== Persistência (localStorage) =====

function carregarRegistros() {
    const bruto = localStorage.getItem(chaveStorage());
    return bruto ? JSON.parse(bruto) : [];
}

function salvarRegistros(registros) {
    localStorage.setItem(chaveStorage(), JSON.stringify(registros));
}

// ===== Regras de negócio =====

// A partir do último registro do dia, descobre se o estado atual é "trabalhando" ou "pausa"
function calcularEstadoAtual(registros) {
    if (registros.length === 0) return "trabalhando";
    const ultimo = registros[registros.length - 1];
    return ultimo.tipo === "Pausa" ? "pausa" : "trabalhando";
}

// Soma todo o tempo em que o estado foi "trabalhando", incluindo o período em aberto até agora
function calcularSegundosTrabalhados(registros) {
    if (registros.length === 0) return 0;

    let totalSegundos = 0;
    let estado = "trabalhando"; // antes do primeiro registro, o dia já "começa" trabalhando
    let ultimoInstante = new Date(registros[0].timestamp);

    for (let i = 0; i < registros.length; i++) {
        const instanteAtual = new Date(registros[i].timestamp);

        if (i > 0) {
            if (estado === "trabalhando") {
                totalSegundos += (instanteAtual - ultimoInstante) / 1000;
            }
            ultimoInstante = instanteAtual;
        }

        estado = registros[i].tipo === "Pausa" ? "pausa" : "trabalhando";
    }

    // Soma o período em aberto, do último registro até agora, se ainda estiver "trabalhando"
    if (estado === "trabalhando") {
        totalSegundos += (new Date() - ultimoInstante) / 1000;
    }

    return Math.floor(totalSegundos);
}

// Se ainda não existe nenhum registro hoje, cria a "Entrada" automaticamente
function iniciarRegistroSeNecessario(registros) {
    if (registros.length === 0) {
        registros.push({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            tipo: "Entrada",
            motivo: "Início do expediente",
            ajustado: false
        });
        salvarRegistros(registros);
    }
    return registros;
}

// ===== Renderização =====

function atualizarPainelPrincipal(registros) {
    const estado = calcularEstadoAtual(registros);
    const segundosTrabalhados = calcularSegundosTrabalhados(registros);

    elHorasTrabalhadas.textContent = formatarTempo(segundosTrabalhados);
    elTempoRestante.textContent = formatarTempo(Math.max(0, JORNADA_SEGUNDOS - segundosTrabalhados));

    if (estado === "trabalhando") {
        elStatusBadge.textContent = "Trabalhando";
        elStatusBadge.className = "status-badge status-trabalhando";
        elBtnPonto.textContent = "Bater Ponto (Ir para Pausa)";
        elBtnPonto.className = "btn-ponto trabalhando";
    } else {
        elStatusBadge.textContent = "Em pausa (Almoço)";
        elStatusBadge.className = "status-badge status-pausa";
        elBtnPonto.textContent = "Bater Ponto (Voltar a Trabalhar)";
        elBtnPonto.className = "btn-ponto pausa";
    }
}

function corDoTipo(tipo) {
    if (tipo === "Entrada") return "tipo-entrada";
    if (tipo === "Pausa") return "tipo-pausa";
    return "tipo-retorno";
}

function renderizarLista(registros) {
    elListaRegistros.innerHTML = "";

    // Mostra do mais recente para o mais antigo
    const ordenados = [...registros].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    ordenados.forEach(registro => {
        const linha = document.createElement("div");
        linha.className = "registro-item";
        linha.dataset.id = registro.id;

        const horaTexto = formatarHora(new Date(registro.timestamp));
        const ajustadoTexto = registro.ajustado ? " (ajustado)" : "";

        linha.innerHTML = `
            <div class="registro-info">
                <span class="registro-tipo ${corDoTipo(registro.tipo)}">${registro.tipo}</span>
                <span class="registro-hora">${horaTexto}</span>
                <span class="registro-motivo">${registro.motivo || "Não informado"}${ajustadoTexto}</span>
            </div>
            <button class="btn-ajustar" data-id="${registro.id}">Ajustar</button>
        `;

        elListaRegistros.appendChild(linha);
    });

    document.querySelectorAll(".btn-ajustar").forEach(botao => {
        botao.addEventListener("click", () => entrarModoEdicao(botao.dataset.id));
    });
}

// Troca a linha de um registro para o modo de edição (campos de hora e motivo)
function entrarModoEdicao(id) {
    const registros = carregarRegistros();
    const registro = registros.find(r => r.id === id);
    if (!registro) return;

    const linha = document.querySelector(`.registro-item[data-id="${id}"]`);
    const horaValor = new Date(registro.timestamp).toTimeString().slice(0, 8); // "HH:MM:SS"

    linha.className = "registro-item registro-editando";
    linha.innerHTML = `
        <div class="registro-info-edicao">
            <span class="registro-tipo ${corDoTipo(registro.tipo)}">${registro.tipo}</span>
            <input type="time" step="1" class="input-hora-edicao" value="${horaValor}" />
            <input type="text" class="input-motivo-edicao" value="${registro.motivo || ""}" placeholder="Motivo" />
        </div>
        <div class="botoes-edicao">
            <button class="btn-salvar" data-id="${id}">Salvar</button>
            <button class="btn-cancelar" data-id="${id}">Cancelar</button>
        </div>
    `;

    linha.querySelector(".btn-salvar").addEventListener("click", () => salvarEdicao(id));
    linha.querySelector(".btn-cancelar").addEventListener("click", () => recarregarTudo());
}

// Salva o novo horário/motivo digitados para um registro (marca como "ajustado")
function salvarEdicao(id) {
    const registros = carregarRegistros();
    const registro = registros.find(r => r.id === id);
    if (!registro) return;

    const linha = document.querySelector(`.registro-item[data-id="${id}"]`);
    const novaHora = linha.querySelector(".input-hora-edicao").value; // "HH:MM:SS"
    const novoMotivo = linha.querySelector(".input-motivo-edicao").value.trim();

    if (novaHora) {
        const [h, m, s] = novaHora.split(":").map(Number);
        const dataOriginal = new Date(registro.timestamp);
        dataOriginal.setHours(h, m, s || 0, 0);
        registro.timestamp = dataOriginal.toISOString();
    }
    registro.motivo = novoMotivo || "Ajuste manual";
    registro.ajustado = true;

    salvarRegistros(registros);
    recarregarTudo();
}

// Recarrega os registros do localStorage e atualiza toda a tela (painel + lista)
function recarregarTudo() {
    const registros = carregarRegistros();
    atualizarPainelPrincipal(registros);
    renderizarLista(registros);
}

// ===== Relógio em tempo real =====
setInterval(() => {
    elRelogioAtual.textContent = formatarHora(new Date());

    // Recalcula o tempo trabalhado a cada segundo direto dos registros salvos
    const registros = carregarRegistros();
    atualizarPainelPrincipal(registros);
}, 1000);

// ===== Clique no botão "Bater Ponto" =====
elBtnPonto.addEventListener("click", () => {
    const registros = carregarRegistros();
    const estadoAtual = calcularEstadoAtual(registros);
    const proximoTipo = estadoAtual === "trabalhando" ? "Pausa" : "Retorno";

    registros.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        tipo: proximoTipo,
        motivo: elMotivoInput.value.trim() || (proximoTipo === "Pausa" ? "Pausa/Almoço" : "Retorno do almoço"),
        ajustado: false
    });

    salvarRegistros(registros);
    elMotivoInput.value = "";
    recarregarTudo();
});

// ===== Inicialização =====
let registrosIniciais = carregarRegistros();
registrosIniciais = iniciarRegistroSeNecessario(registrosIniciais);
atualizarPainelPrincipal(registrosIniciais);
renderizarLista(registrosIniciais);