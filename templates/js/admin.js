// ============================
// EstetickElite - script.js
// Dados de agendamentos (localStorage) + lógica do painel admin
// ============================


    // PROTEÇÃO ADMINISTRATIVA //

  

        if (
        sessionStorage.getItem("adminLogado")
        !== "true"
        ) {

            window.location.href =
            "./login-admin.html";

        }

  
const AGENDAMENTOS_KEY = "esteticelite_agendamentos";

// ---------- Dados ----------

function getAgendamentos() {
    try {
        const dados = localStorage.getItem(AGENDAMENTOS_KEY);
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao ler agendamentos:", erro);
        return [];
    }
}

function salvarAgendamentos(lista) {
    localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(lista));
}

function adicionarAgendamento(agendamento) {
    const lista = getAgendamentos();
    lista.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        status: "agendado",
        criadoEm: new Date().toISOString(),
        ...agendamento
    });
    salvarAgendamentos(lista);
}

function marcarComoFeito(id) {
    const lista = getAgendamentos();
    const item = lista.find((a) => a.id === id);
    if (item) {
        item.status = "feito";
        item.concluidoEm = new Date().toISOString();
        salvarAgendamentos(lista);
    }
    if (document.getElementById("totalAgendados")) {
        renderPainelAdmin();
    }
}

function excluirAgendamento(id) {
    const lista = getAgendamentos().filter((a) => a.id !== id);
    salvarAgendamentos(lista);
    if (document.getElementById("totalAgendados")) {
        renderPainelAdmin();
    }
}

// ---------- Formulário de agendamento (agendamento.html) ----------

function initFormAgendamento() {
    const form = document.getElementById("formAgendamento");
    if (!form) return;

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("nomeCliente").value.trim();
        const telefone = document.getElementById("telefoneCliente").value.trim();
        const servico = document.getElementById("servicoEscolhido").value;
        const data = document.getElementById("dataAgendamento").value;
        const hora = document.getElementById("horaAgendamento").value;

        if (!nome || !telefone || !servico || !data || !hora) {
            alert("Preencha todos os campos para agendar.");
            return;
        }

        adicionarAgendamento({ nome, telefone, servico, data, hora });

        form.reset();

        const confirmacao = document.getElementById("confirmacaoAgendamento");
        if (confirmacao) {
            confirmacao.classList.remove("d-none");
        } else {
            alert("Agendamento realizado com sucesso!");
        }
    });
}

// ---------- Painel administrativo (admin.html) ----------

let graficoStatusChart = null;
let graficoServicosChart = null;

function renderPainelAdmin() {
    const lista = getAgendamentos();

    const agendados = lista.filter((a) => a.status === "agendado");
    const feitos = lista.filter((a) => a.status === "feito");

    // Estatísticas
    document.getElementById("totalAgendados").textContent = agendados.length;
    document.getElementById("totalFeitos").textContent = feitos.length;
    document.getElementById("totalServicos").textContent = lista.length;

    const taxa = lista.length
        ? Math.round((feitos.length / lista.length) * 100)
        : 0;
    document.getElementById("taxaConclusao").textContent = taxa + "%";

    document.getElementById("contadorAgendados").textContent = agendados.length;
    document.getElementById("contadorFeitos").textContent = feitos.length;

    // Listas
    renderListaAgendamentos("listaAgendados", agendados, true);
    renderListaAgendamentos("listaFeitos", feitos, false);

    // Gráficos
    renderGraficoStatus(agendados.length, feitos.length);
    renderGraficoServicos(lista);
}

function renderListaAgendamentos(idContainer, itens, mostrarAcaoConcluir) {
    const container = document.getElementById(idContainer);
    if (!container) return;

    if (itens.length === 0) {
        container.innerHTML = '<p class="sem-itens">Nenhum item por aqui ainda.</p>';
        return;
    }

    container.innerHTML = itens
        .slice()
        .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
        .map((item) => `
            <div class="item-agendamento" data-id="${item.id}">
                <div class="item-info">
                    <strong>${escapeHtml(item.nome)}</strong>
                    <span>${escapeHtml(item.servico)}</span>
                    <span>${formatarData(item.data)} às ${item.hora}</span>
                    <span>${escapeHtml(item.telefone)}</span>
                </div>
                <div class="item-acoes">
                    ${mostrarAcaoConcluir
                ? `<button class="btn-concluir" onclick="marcarComoFeito('${item.id}')">Concluir</button>`
                : ""}
                    <button class="btn-excluir" onclick="excluirAgendamento('${item.id}')">Excluir</button>
                </div>
            </div>
        `)
        .join("");
}

function renderGraficoStatus(totalAgendados, totalFeitos) {
    const canvas = document.getElementById("graficoStatus");
    if (!canvas) return;

    if (graficoStatusChart) graficoStatusChart.destroy();

    graficoStatusChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Agendados", "Feitos"],
            datasets: [{
                data: [totalAgendados, totalFeitos],
                backgroundColor: ["#f0a5c4", "#7c3f61"]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: "bottom" } }
        }
    });
}

function renderGraficoServicos(lista) {
    const canvas = document.getElementById("graficoServicos");
    if (!canvas) return;

    const contagem = {};
    lista.forEach((item) => {
        contagem[item.servico] = (contagem[item.servico] || 0) + 1;
    });

    const labels = Object.keys(contagem);
    const valores = Object.values(contagem);

    if (graficoServicosChart) graficoServicosChart.destroy();

    graficoServicosChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels.length ? labels : ["Sem dados"],
            datasets: [{
                label: "Agendamentos",
                data: valores.length ? valores : [0],
                backgroundColor: "#c65d8a"
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            plugins: { legend: { display: false } }
        }
    });
}

// ---------- Utilitários ----------

function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// ---------- Inicialização ----------

document.addEventListener("DOMContentLoaded", function () {
    initFormAgendamento();

    if (document.getElementById("totalAgendados")) {
        renderPainelAdmin();
    }
});