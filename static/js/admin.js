document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // PROTEÇÃO DO PAINEL
    // =====================================================

    if (sessionStorage.getItem("adminLogado") !== "true") {

        window.location.href = "./login-admin.html";

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

        try {

            const dados =
                localStorage.getItem(
                    "agendamentosEstetickElite"
                );

            if (!dados) {
                return [];
            }

            const agendamentos =
                JSON.parse(dados);

            if (!Array.isArray(agendamentos)) {
                return [];
            }

            return agendamentos;

        } catch (erro) {

            console.error(
                "Erro ao carregar agendamentos:",
                erro
            );

            return [];
        }
    }

    // =====================================================
    // SALVAR
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

        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );
    }

    // =====================================================
    // PROTEGER TEXTO
    // =====================================================

    function escaparHTML(texto) {

        const elemento =
            document.createElement("div");

        elemento.textContent =
            texto || "";

        return elemento.innerHTML;
    }

    // =====================================================
    // GRÁFICOS
    // =====================================================

    let graficoStatus = null;
    let graficoServicos = null;

    // =====================================================
    // CARREGAR AGENDAMENTOS
    // =====================================================

    function carregarAgendamentos() {

        const agendamentos =
            pegarAgendamentos();

        // Tudo que não estiver como "feito"
        // continua na lista de agendados
        const agendados =
            agendamentos.filter(function (item) {

                return item.status !== "feito";
            });

        const feitos =
            agendamentos.filter(function (item) {

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
        // TAXA
        // =================================================

        let taxa = 0;

        if (agendamentos.length > 0) {

            taxa = Math.round(
                (feitos.length /
                agendamentos.length) * 100
            );
        }

        if (taxaConclusao) {

            taxaConclusao.textContent =
                taxa + "%";
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

            agendados.forEach(function (item) {

                const card =
                    document.createElement("div");

                card.className =
                    "card-agendamento-admin";

                card.innerHTML = `

                    <div class="agendamento-info">

                        <h3>
                            ${escaparHTML(item.nome)}
                        </h3>

                        <p>
                            <strong>Veículo:</strong>
                            ${escaparHTML(item.veiculo)}
                        </p>

                        <p>
                            <strong>Placa:</strong>
                            ${escaparHTML(item.placa)}
                        </p>

                        <p>
                            <strong>Serviço:</strong>
                            ${escaparHTML(item.servico)}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarData(item.data)}
                        </p>

                        <p>
                            <strong>Horário:</strong>
                            ${escaparHTML(item.horario)}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparHTML(
                                item.observacoes ||
                                "Nenhuma observação"
                            )}
                        </p>

                        <p>
                            <strong>Pagamento:</strong>
                            ${escaparHTML(
                                item.pagamento ||
                                "Não informado"
                            )}
                        </p>

                    </div>

                    <button
                        type="button"
                        class="btn-concluir-agendamento"
                        data-id="${item.id}"
                    >
                        Marcar como concluído
                    </button>

                `;

                listaAgendados.appendChild(card);
            });
        }

        // =================================================
        // LISTA DE FEITOS
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

            feitos.forEach(function (item) {

                const card =
                    document.createElement("div");

                card.className =
                    "card-agendamento-admin";

                card.innerHTML = `

                    <div class="agendamento-info">

                        <h3>
                            ${escaparHTML(item.nome)}
                        </h3>

                        <p>
                            <strong>Veículo:</strong>
                            ${escaparHTML(item.veiculo)}
                        </p>

                        <p>
                            <strong>Placa:</strong>
                            ${escaparHTML(item.placa)}
                        </p>

                        <p>
                            <strong>Serviço:</strong>
                            ${escaparHTML(item.servico)}
                        </p>

                        <p>
                            <strong>Data:</strong>
                            ${formatarData(item.data)}
                        </p>

                        <p>
                            <strong>Horário:</strong>
                            ${escaparHTML(item.horario)}
                        </p>

                        <p>
                            <strong>Observações:</strong>
                            ${escaparHTML(
                                item.observacoes ||
                                "Nenhuma observação"
                            )}
                        </p>

                        <p>
                            <strong>Pagamento:</strong>
                            ${escaparHTML(
                                item.pagamento ||
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
        // GRÁFICOS
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

            if (!agendamento) {
                return;
            }

            agendamento.status =
                "feito";

            salvarAgendamentos(
                agendamentos
            );

            carregarAgendamentos();
        }
    );

    // =====================================================
    // GRÁFICOS
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
        // STATUS
        // =================================================

        if (canvasStatus) {

            if (graficoStatus) {
                graficoStatus.destroy();
            }

            graficoStatus =
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
        // SERVIÇOS
        // =================================================

        if (canvasServicos) {

            if (graficoServicos) {
                graficoServicos.destroy();
            }

            const todos =
                agendados.concat(feitos);

            const quantidade = {};

            todos.forEach(function (item) {

                const servico =
                    item.servico ||
                    "Não informado";

                if (!quantidade[servico]) {
                    quantidade[servico] = 0;
                }

                quantidade[servico]++;
            });

            graficoServicos =
                new Chart(
                    canvasServicos,
                    {
                        type: "bar",

                        data: {

                            labels:
                                Object.keys(
                                    quantidade
                                ),

                            datasets: [
                                {
                                    label:
                                        "Agendamentos",

                                    data:
                                        Object.values(
                                            quantidade
                                        ),

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
                                        color:
                                            "#cccccc"
                                    },

                                    grid: {
                                        color:
                                            "#292929"
                                    }
                                },

                                y: {

                                    beginAtZero: true,

                                    ticks: {
                                        color:
                                            "#cccccc",
                                        precision: 0
                                    },

                                    grid: {
                                        color:
                                            "#292929"
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

