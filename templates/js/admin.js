// =========================================================
// ESTETICKELITE
// PAINEL ADMINISTRATIVO
// AGENDAMENTOS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // VERIFICAR LOGIN
    // =====================================================

    if (sessionStorage.getItem("adminLogado") !== "true") {

        window.location.replace("./login-admin.html");

        return;
    }

    // =====================================================
    // ELEMENTOS
    // =====================================================

    const listaAgendados =
        document.getElementById("listaAgendados");

    const listaFeitos =
        document.getElementById("listaFeitos");

    const totalAgendados =
        document.getElementById("totalAgendados");

    const totalFeitos =
        document.getElementById("totalFeitos");

    const totalServicos =
        document.getElementById("totalServicos");

    const taxaConclusao =
        document.getElementById("taxaConclusao");

    const contadorAgendados =
        document.getElementById("contadorAgendados");

    const contadorFeitos =
        document.getElementById("contadorFeitos");

    // =====================================================
    // PEGAR AGENDAMENTOS
    // =====================================================

    function pegarAgendamentos() {

        return JSON.parse(
            localStorage.getItem(
                "agendamentosEstetickElite"
            )
        ) || [];
    }

    // =====================================================
    // SALVAR AGENDAMENTOS
    // =====================================================

    function salvarAgendamentos(agendamentos) {

        localStorage.setItem(
            "agendamentosEstetickElite",
            JSON.stringify(agendamentos)
        );
    }

    // =====================================================
    // FORMATAR DATA
    // =====================================================

    function formatarData(data) {

        if (!data) {
            return "Não informada";
        }

        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    // =====================================================
    // PROTEGER HTML
    // =====================================================

    function escaparHTML(texto) {

        const div = document.createElement("div");

        div.textContent = texto ?? "";

        return div.innerHTML;
    }

    // =====================================================
    // GRÁFICOS
    // =====================================================

    let graficoStatusAtual = null;

    let graficoServicosAtual = null;

    // =====================================================
    // CARREGAR AGENDAMENTOS
    // =====================================================

    function carregarAgendamentos() {

        const agendamentos = pegarAgendamentos();

        // Agendamentos que ainda não foram feitos
        const agendados = agendamentos.filter(function (item) {

            return item.status !== "feito";
        });

        // Serviços concluídos
        const feitos = agendamentos.filter(function (item) {

            return item.status === "feito";
        });

        // =================================================
        // CONTADORES
        // =================================================

        if (totalAgendados) {
            totalAgendados.textContent =
                agendados.length;
        }

        if (totalFeitos) {
            totalFeitos.textContent =
                feitos.length;
        }

        if (totalServicos) {
            totalServicos.textContent =
                agendamentos.length;
        }

        if (contadorAgendados) {
            contadorAgendados.textContent =
                agendados.length;
        }

        if (contadorFeitos) {
            contadorFeitos.textContent =
                feitos.length;
        }

        // =================================================
        // TAXA DE CONCLUSÃO
        // =================================================

        let taxa = 0;

        if (agendamentos.length > 0) {

            taxa = Math.round(
                (feitos.length / agendamentos.length) * 100
            );
        }

        if (taxaConclusao) {

            taxaConclusao.textContent =
                `${taxa}%`;
        }

        // =================================================
        // LISTA DE AGENDADOS
        // =================================================

        if (listaAgendados) {

            listaAgendados.innerHTML = "";

            if (agendados.length === 0) {

                listaAgendados.innerHTML = `
                    <div class="agendamento-vazio">
                        Nenhum agendamento encontrado.
                    </div>
                `;
            }

            agendados.forEach(function (agendamento) {

                const card =
                    document.createElement("div");

                card.className =
                    "card-agendamento-admin";

                card.innerHTML = `

                    <div class="agendamento-info">

                        <h3>
                            ${escaparHTML(agendamento.nome)}
                        </h3>

                        <p>
                            <strong>Veículo:</strong>
                            ${escaparHTML(agendamento.veiculo)}
                        </p>

                        <p>
                            <strong>Placa:</strong>
                            ${escaparHTML(agendamento.placa)}
                        </p>

                        <p>
                            <strong>Serviço:</strong>
                            ${escaparHTML(agendamento.servico)}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarData(agendamento.data)}
                        </p>

                        <p>
                            <strong>Horário:</strong>
                            ${escaparHTML(agendamento.horario)}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparHTML(
                                agendamento.observacoes ||
                                "Nenhuma observação"
                            )}
                        </p>

                        <p>
                            <strong>Pagamento:</strong>
                            ${escaparHTML(
                                agendamento.pagamento ||
                                "Não informado"
                            )}
                        </p>

                    </div>

                    <button
                        type="button"
                        class="btn-concluir-agendamento"
                        data-id="${agendamento.id}"
                    >
                        Marcar como concluído
                    </button>
                `;

                listaAgendados.appendChild(card);
            });
        }

        // =================================================
        // LISTA DE SERVIÇOS FEITOS
        // =================================================

        if (listaFeitos) {

            listaFeitos.innerHTML = "";

            if (feitos.length === 0) {

                listaFeitos.innerHTML = `
                    <div class="agendamento-vazio">
                        Nenhum serviço concluído.
                    </div>
                `;
            }

            feitos.forEach(function (agendamento) {

                const card =
                    document.createElement("div");

                card.className =
                    "card-agendamento-admin";

                card.innerHTML = `

                    <div class="agendamento-info">

                        <h3>
                            ${escaparHTML(agendamento.nome)}
                        </h3>

                        <p>
                            <strong>Veículo:</strong>
                            ${escaparHTML(agendamento.veiculo)}
                        </p>

                        <p>
                            <strong>Placa:</strong>
                            ${escaparHTML(agendamento.placa)}
                        </p>

                        <p>
                            <strong>Serviço:</strong>
                            ${escaparHTML(agendamento.servico)}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarData(agendamento.data)}
                        </p>

                        <p>
                            <strong>Horário:</strong>
                            ${escaparHTML(agendamento.horario)}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparHTML(
                                agendamento.observacoes ||
                                "Nenhuma observação"
                            )}
                        </p>

                        <p>
                            <strong>Pagamento:</strong>
                            ${escaparHTML(
                                agendamento.pagamento ||
                                "Não informado"
                            )}
                        </p>

                        <p class="status-concluido">
                            Serviço concluído
                        </p>

                    </div>
                `;

                listaFeitos.appendChild(card);
            });
        }

        // =================================================
        // ATUALIZAR GRÁFICOS
        // =================================================

        criarGraficos(
            agendados,
            feitos
        );
    }

    // =====================================================
    // MARCAR COMO CONCLUÍDO
    // =====================================================

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.classList.contains(
                    "btn-concluir-agendamento"
                )
            ) {
                return;
            }

            const id =
                Number(event.target.dataset.id);

            const agendamentos =
                pegarAgendamentos();

            const agendamento =
                agendamentos.find(function (item) {

                    return item.id === id;
                });

            if (agendamento) {

                agendamento.status = "feito";

                salvarAgendamentos(
                    agendamentos
                );

                carregarAgendamentos();
            }
        }
    );

    // =====================================================
    // CRIAR GRÁFICOS
    // =====================================================

    function criarGraficos(
        agendados,
        feitos
    ) {

        if (typeof Chart === "undefined") {
            return;
        }

        const canvasStatus =
            document.getElementById(
                "graficoStatus"
            );

        const canvasServicos =
            document.getElementById(
                "graficoServicos"
            );

        // =================================================
        // GRÁFICO STATUS
        // =================================================

        if (canvasStatus) {

            if (graficoStatusAtual) {
                graficoStatusAtual.destroy();
            }

            graficoStatusAtual =
                new Chart(
                    canvasStatus,
                    {
                        type: "doughnut",

                        data: {

                            labels: [
                                "Agendados",
                                "Concluídos"
                            ],

                            datasets: [
                                {
                                    data: [
                                        agendados.length,
                                        feitos.length
                                    ],

                                    backgroundColor: [
                                        "#d4af37",
                                        "#555555"
                                    ],

                                    borderWidth: 0
                                }
                            ]
                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    labels: {
                                        color: "#ffffff"
                                    }
                                }
                            }
                        }
                    }
                );
        }

        // =================================================
        // GRÁFICO SERVIÇOS
        // =================================================

        if (canvasServicos) {

            if (graficoServicosAtual) {
                graficoServicosAtual.destroy();
            }

            const todos =
                agendados.concat(feitos);

            const contagem = {};

            todos.forEach(function (item) {

                const nomeServico =
                    item.servico || "Não informado";

                if (!contagem[nomeServico]) {

                    contagem[nomeServico] = 0;
                }

                contagem[nomeServico]++;
            });

            graficoServicosAtual =
                new Chart(
                    canvasServicos,
                    {
                        type: "bar",

                        data: {

                            labels:
                                Object.keys(contagem),

                            datasets: [
                                {
                                    label:
                                        "Quantidade",

                                    data:
                                        Object.values(contagem),

                                    backgroundColor:
                                        "#d4af37",

                                    borderRadius: 6
                                }
                            ]
                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            scales: {

                                x: {

                                    ticks: {
                                        color: "#cccccc"
                                    },

                                    grid: {
                                        color: "#292929"
                                    }
                                },

                                y: {

                                    beginAtZero: true,

                                    ticks: {
                                        color: "#cccccc"
                                    },

                                    grid: {
                                        color: "#292929"
                                    }
                                }
                            },

                            plugins: {

                                legend: {
                                    display: false
                                }
                            }
                        }
                    }
                );
        }
    }

    // =====================================================
    // INICIAR
    // =====================================================

    carregarAgendamentos();

});

